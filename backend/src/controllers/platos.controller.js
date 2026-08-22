import mongoose from 'mongoose';
import Plato from '../models/Plato.js';

// GET /api/platos - Listar platos disponibles (con filtro opcional por categoría)
export const getPlatos = async (req, res) => {
  try {
    const { categoria } = req.query;

    // Filtro base: solo platos disponibles
    const filtro = { disponible: true };

    // Agregar filtro por categoría si se proporciona
    if (categoria && typeof categoria === 'string') {
      filtro.categoria = String(categoria).trim();
    }

    const platos = await Plato.find(filtro).sort({ categoria: 1, nombre: 1 });

    res.json({
      success: true,
      count: platos.length,
      platos,
    });
  } catch (error) {
    console.error('Error al obtener platos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los platos.',
    });
  }
};

// GET /api/platos/:id - Obtener un plato por su ID
export const getPlatoById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de plato no válido.',
      });
    }

    const plato = await Plato.findById(req.params.id);

    if (!plato) {
      return res.status(404).json({
        success: false,
        message: 'Plato no encontrado.',
      });
    }

    res.json({
      success: true,
      plato,
    });
  } catch (error) {
    console.error('Error al obtener plato:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el plato.',
    });
  }
};

// POST /api/platos - Crear nuevo plato (solo cocinero)
export const createPlato = async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen, categoria, disponible } = req.body;

    if (!nombre || !descripcion || precio === undefined || !categoria) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, descripción, precio y categoría son obligatorios.',
      });
    }

    const numPrecio = parseFloat(precio);
    if (isNaN(numPrecio) || numPrecio < 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser un número válido mayor o igual a 0.',
      });
    }

    const plato = await Plato.create({
      nombre: String(nombre).trim(),
      descripcion: String(descripcion).trim(),
      precio: numPrecio,
      imagen: imagen ? String(imagen).trim() : '',
      categoria: String(categoria).trim(),
      disponible: disponible !== undefined ? Boolean(disponible) : true,
    });

    res.status(201).json({
      success: true,
      message: 'Plato creado exitosamente.',
      plato,
    });
  } catch (error) {
    console.error('Error al crear plato:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el plato.',
    });
  }
};

// PUT /api/platos/:id - Actualizar plato (solo cocinero)
export const updatePlato = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de plato no válido.',
      });
    }

    const allowedUpdates = ['nombre', 'descripcion', 'precio', 'imagen', 'categoria', 'disponible'];
    const updateData = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    if (updateData.precio !== undefined) {
      const numPrecio = parseFloat(updateData.precio);
      if (isNaN(numPrecio) || numPrecio < 0) {
        return res.status(400).json({
          success: false,
          message: 'El precio debe ser un número válido mayor o igual a 0.',
        });
      }
      updateData.precio = numPrecio;
    }

    const plato = await Plato.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!plato) {
      return res.status(404).json({
        success: false,
        message: 'Plato no encontrado.',
      });
    }

    res.json({
      success: true,
      message: 'Plato actualizado exitosamente.',
      plato,
    });
  } catch (error) {
    console.error('Error al actualizar plato:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el plato.',
    });
  }
};

// DELETE /api/platos/:id - Eliminar plato (solo cocinero)
export const deletePlato = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de plato no válido.',
      });
    }

    const plato = await Plato.findByIdAndDelete(req.params.id);

    if (!plato) {
      return res.status(404).json({
        success: false,
        message: 'Plato no encontrado.',
      });
    }

    res.json({
      success: true,
      message: 'Plato eliminado exitosamente.',
    });
  } catch (error) {
    console.error('Error al eliminar plato:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el plato.',
    });
  }
};
