import mongoose from 'mongoose';

// Sub-esquema para cada item del pedido
const itemPedidoSchema = new mongoose.Schema(
  {
    plato: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plato',
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: [1, 'La cantidad mínima es 1'],
    },
  },
  { _id: false }
);

// Sub-esquema para la dirección de entrega
const direccionSchema = new mongoose.Schema(
  {
    calle: {
      type: String,
      required: [true, 'La calle es obligatoria'],
    },
    ciudad: {
      type: String,
      required: [true, 'La ciudad es obligatoria'],
    },
    codigoPostal: {
      type: String,
    },
    referencia: {
      type: String,
    },
  },
  { _id: false }
);

// Esquema principal del pedido
const pedidoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El cliente es obligatorio'],
    },
    items: {
      type: [itemPedidoSchema],
      required: [true, 'Los items son obligatorios'],
      validate: {
        validator: (v) => v.length > 0,
        message: 'El pedido debe tener al menos un item',
      },
    },
    total: {
      type: Number,
      required: [true, 'El total es obligatorio'],
    },
    direccion: {
      type: direccionSchema,
      required: [true, 'La dirección es obligatoria'],
    },
    estado: {
      type: String,
      enum: {
        values: ['pendiente', 'en_preparacion', 'listo', 'entregado'],
        message: 'Estado no válido: {VALUE}',
      },
      default: 'pendiente',
    },
    paypalOrderId: {
      type: String,
    },
    paypalStatus: {
      type: String,
    },
  },
  { timestamps: true }
);

const Pedido = mongoose.model('Pedido', pedidoSchema);

export default Pedido;
