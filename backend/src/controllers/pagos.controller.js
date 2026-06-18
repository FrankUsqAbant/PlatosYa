import Pedido from '../models/Pedido.js';
import { getIO } from '../sockets/index.js';

// POST /api/pagos/verificar - Verificar pago y crear pedido
export const verificarPago = async (req, res) => {
  try {
    const { paypalOrderId, items, total, direccion } = req.body;

    console.log('💳 POST /pagos/verificar recibido');
    console.log('  → Usuario:', req.user?.id, req.user?.role);
    console.log('  → PayPal ID:', paypalOrderId);
    console.log('  → Items:', items?.length, 'Total:', total);

    // Validar datos requeridos
    if (!paypalOrderId) {
      return res.status(400).json({
        success: false,
        message: 'El ID de orden de PayPal es obligatorio.',
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Los items del pedido son obligatorios.',
      });
    }

    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El total debe ser mayor a 0.',
      });
    }

    if (!direccion || !direccion.calle || !direccion.ciudad) {
      return res.status(400).json({
        success: false,
        message: 'La dirección con calle y ciudad es obligatoria.',
      });
    }

    // TODO: Aquí se integraría la verificación real con la API de PayPal
    // Por ahora, aceptamos el pago directamente y creamos el pedido
    // En producción: llamar a PayPal Orders API para verificar el pago

    // Crear el pedido con el pago verificado
    const pedido = await Pedido.create({
      cliente: req.user.id,
      items,
      total,
      direccion,
      paypalOrderId,
      paypalStatus: 'COMPLETED',
      estado: 'pendiente',
    });

    // Popular datos del cliente
    await pedido.populate('cliente', 'nombre email');

    // Emitir evento de socket para notificar a los cocineros
    const io = getIO();
    if (io) {
      io.to('cocineros').emit('pedido:nuevo', pedido);
      console.log('📡 Evento pedido:nuevo emitido (pago verificado)');
    }

    res.status(201).json({
      success: true,
      message: 'Pago verificado y pedido creado exitosamente.',
      pedido,
    });
  } catch (error) {
    console.error('Error al verificar pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar el pago.',
      error: error.message,
    });
  }
};
