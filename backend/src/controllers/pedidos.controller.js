import mongoose from 'mongoose';
import Pedido from '../models/Pedido.js';
import Plato from '../models/Plato.js';
import { getIO } from '../sockets/index.js';

// Helper para calcular y validar items contra la base de datos
const calculateOrderTotal = async (items) => {
  const platoIds = items.map((it) => it.plato || it._id);
  const dbPlatos = await Plato.find({ _id: { $in: platoIds } });
  const platoMap = new Map(dbPlatos.map((p) => [p._id.toString(), p]));

  let calculatedTotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const pId = (item.plato || item._id)?.toString();
    const dbPlato = platoMap.get(pId);

    if (!dbPlato) {
      throw new Error(`El plato con ID ${pId} no existe en el catálogo.`);
    }

    const cantidad = Math.max(1, parseInt(item.cantidad, 10) || 1);
    const precio = dbPlato.precio;
    calculatedTotal += precio * cantidad;

    verifiedItems.push({
      plato: dbPlato._id,
      nombre: dbPlato.nombre,
      precio: precio,
      cantidad: cantidad,
    });
  }

  return {
    total: Math.round(calculatedTotal * 100) / 100,
    items: verifiedItems,
  };
};

// POST /api/pedidos - Crear un nuevo pedido
export const createPedido = async (req, res) => {
  try {
    const { items, direccion, paypalOrderId } = req.body;

    // Validar que haya items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El pedido debe tener al menos un plato.',
      });
    }

    // Validar dirección
    if (!direccion || !direccion.calle || !direccion.ciudad) {
      return res.status(400).json({
        success: false,
        message: 'La dirección con calle y ciudad es obligatoria.',
      });
    }

    // Validar y recalcular precios en el backend (prevención de Price Tampering)
    const { total: secureTotal, items: secureItems } = await calculateOrderTotal(items);

    // Crear el pedido
    const pedido = await Pedido.create({
      cliente: req.user.id,
      items: secureItems,
      total: secureTotal,
      direccion: {
        calle: String(direccion.calle).trim(),
        ciudad: String(direccion.ciudad).trim(),
        codigoPostal: direccion.codigoPostal ? String(direccion.codigoPostal).trim() : '',
        referencia: direccion.referencia ? String(direccion.referencia).trim() : '',
      },
      paypalOrderId: paypalOrderId || null,
      paypalStatus: paypalOrderId ? 'COMPLETED' : null,
      estado: 'pendiente',
    });

    // Popular datos del cliente para la respuesta
    await pedido.populate('cliente', 'nombre email');

    // Emitir evento de socket para notificar a los cocineros
    const io = getIO();
    if (io) {
      io.to('cocineros').emit('pedido:nuevo', pedido);
      console.log('📡 Evento pedido:nuevo emitido a cocineros');
    }

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente.',
      pedido,
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al crear el pedido.',
    });
  }
};

// GET /api/pedidos - Obtener pedidos (cocinero: todos, cliente: solo los suyos)
export const getPedidos = async (req, res) => {
  try {
    let filtro = {};

    // Si es cliente, solo ver sus propios pedidos
    if (req.user.role === 'cliente') {
      filtro.cliente = req.user.id;
    }

    const pedidos = await Pedido.find(filtro)
      .populate('cliente', 'nombre email')
      .populate('items.plato', 'imagen')
      .sort({ createdAt: -1 });

    // Enriquecer items con la imagen del plato
    const pedidosEnriquecidos = pedidos.map((pedido) => {
      const p = pedido.toObject();
      p.items = p.items.map((item) => ({
        ...item,
        imagen: item.plato?.imagen || null,
        plato: item.plato?._id || item.plato,
      }));
      return p;
    });

    res.json({
      success: true,
      count: pedidosEnriquecidos.length,
      pedidos: pedidosEnriquecidos,
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los pedidos.',
    });
  }
};

// GET /api/pedidos/:id - Obtener un pedido por ID
export const getPedidoById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de pedido no válido.',
      });
    }

    const pedido = await Pedido.findById(req.params.id).populate('cliente', 'nombre email');

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado.',
      });
    }

    // Si es cliente, verificar que sea el dueño del pedido
    if (req.user.role === 'cliente' && pedido.cliente?._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para ver este pedido.',
      });
    }

    res.json({
      success: true,
      pedido,
    });
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el pedido.',
    });
  }
};

// PATCH /api/pedidos/:id/estado - Actualizar estado del pedido (solo cocinero)
export const updateEstado = async (req, res) => {
  try {
    const { estado } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de pedido no válido.',
      });
    }

    // Validar que se proporcione un estado
    if (!estado) {
      return res.status(400).json({
        success: false,
        message: 'El estado es obligatorio.',
      });
    }

    // Validar que el estado sea válido
    const estadosValidos = ['pendiente', 'en_preparacion', 'listo', 'entregado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: `Estado no válido. Estados permitidos: ${estadosValidos.join(', ')}`,
      });
    }

    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    ).populate('cliente', 'nombre email');

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado.',
      });
    }

    // Emitir evento de socket para notificar la actualización
    const io = getIO();
    if (io) {
      io.emit('pedido:actualizado', pedido);
      if (pedido.cliente?._id) {
        io.to(`user:${pedido.cliente._id}`).emit('pedido:actualizado', pedido);
      }
      console.log(`📡 Evento pedido:actualizado emitido (pedido: ${pedido._id}, estado: ${estado})`);
    }

    res.json({
      success: true,
      message: `Estado del pedido actualizado a: ${estado}`,
      pedido,
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado del pedido.',
    });
  }
};
