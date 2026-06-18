import Pedido from '../models/Pedido.js';
import { getIO } from '../sockets/index.js';

// POST /api/pedidos - Crear un nuevo pedido
export const createPedido = async (req, res) => {
  try {
    const { items, total, direccion, paypalOrderId } = req.body;

    // Validar que haya items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El pedido debe tener al menos un item.',
      });
    }

    // Validar dirección
    if (!direccion || !direccion.calle || !direccion.ciudad) {
      return res.status(400).json({
        success: false,
        message: 'La dirección con calle y ciudad es obligatoria.',
      });
    }

    // Crear el pedido
    const pedido = await Pedido.create({
      cliente: req.user.id,
      items,
      total,
      direccion,
      paypalOrderId: paypalOrderId || null,
      paypalStatus: paypalOrderId ? 'COMPLETED' : null,
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
    res.status(500).json({
      success: false,
      message: 'Error al crear el pedido.',
      error: error.message,
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
    const pedidosEnriquecidos = pedidos.map(pedido => {
      const p = pedido.toObject();
      p.items = p.items.map(item => ({
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
      error: error.message,
    });
  }
};

// GET /api/pedidos/:id - Obtener un pedido por ID
export const getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('cliente', 'nombre email');

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado.',
      });
    }

    // Si es cliente, verificar que sea el dueño del pedido
    if (req.user.role === 'cliente' && pedido.cliente._id.toString() !== req.user.id) {
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
      error: error.message,
    });
  }
};

// PATCH /api/pedidos/:id/estado - Actualizar estado del pedido (solo cocinero)
export const updateEstado = async (req, res) => {
  try {
    const { estado } = req.body;

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
      // Notificar a todos los clientes conectados
      io.emit('pedido:actualizado', pedido);
      // Notificar específicamente al cliente dueño del pedido
      io.to(`user:${pedido.cliente._id}`).emit('pedido:actualizado', pedido);
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
      error: error.message,
    });
  }
};
