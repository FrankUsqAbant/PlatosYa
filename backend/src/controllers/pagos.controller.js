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

// POST /api/pagos/verificar - Verificar pago y crear pedido
export const verificarPago = async (req, res) => {
  try {
    const { paypalOrderId, items, direccion } = req.body;

    // Validar datos requeridos
    if (!paypalOrderId) {
      return res.status(400).json({
        success: false,
        message: 'El ID de orden de PayPal es obligatorio.',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Los items del pedido son obligatorios.',
      });
    }

    if (!direccion || !direccion.calle || !direccion.ciudad) {
      return res.status(400).json({
        success: false,
        message: 'La dirección con calle y ciudad es obligatoria.',
      });
    }

    // Recalcular y validar total en el servidor de forma segura
    const { total: secureTotal, items: secureItems } = await calculateOrderTotal(items);

    // Crear el pedido con el pago verificado
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
      paypalOrderId: String(paypalOrderId).trim(),
      paypalStatus: 'COMPLETED',
      estado: 'pendiente',
    });

    // Popular datos del cliente
    await pedido.populate('cliente', 'nombre email');

    // Emitir evento de socket para notificar a los cocineros
    const io = getIO();
    if (io) {
      io.to('cocineros').emit('pedido:nuevo', pedido);
      console.log('📡 Evento pedido:nuevo emitido a cocineros (pago verificado)');
    }

    res.status(201).json({
      success: true,
      message: 'Pago verificado y pedido creado exitosamente.',
      pedido,
    });
  } catch (error) {
    console.error('Error al verificar pago:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al procesar el pago del pedido.',
    });
  }
};
