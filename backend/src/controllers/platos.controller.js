import Plato from '../models/Plato.js';

// GET /api/platos - Listar platos disponibles (con filtro opcional por categoría)
export const getPlatos = async (req, res) => {
  try {
    const { categoria } = req.query;

    // Filtro base: solo platos disponibles
    const filtro = { disponible: true };

    // Agregar filtro por categoría si se proporciona
    if (categoria) {
      filtro.categoria = categoria;
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
      error: error.message,
    });
  }
};

// GET /api/platos/:id - Obtener un plato por su ID
export const getPlatoById = async (req, res) => {
  try {
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
      error: error.message,
    });
  }
};

// POST /api/platos - Crear nuevo plato (solo cocinero)
export const createPlato = async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen, categoria, disponible } = req.body;

    const plato = await Plato.create({
      nombre,
      descripcion,
      precio,
      imagen: imagen || '',
      categoria,
      disponible: disponible !== undefined ? disponible : true,
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
      error: error.message,
    });
  }
};

// PUT /api/platos/:id - Actualizar plato (solo cocinero)
export const updatePlato = async (req, res) => {
  try {
    const plato = await Plato.findByIdAndUpdate(
      req.params.id,
      req.body,
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
      error: error.message,
    });
  }
};

// DELETE /api/platos/:id - Eliminar plato (solo cocinero)
export const deletePlato = async (req, res) => {
  try {
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
      error: error.message,
    });
  }
};
