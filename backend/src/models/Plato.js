import mongoose from 'mongoose';

// Esquema de plato del menú del restaurante
const platoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del plato es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    imagen: {
      type: String,
      default: '',
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: {
        values: ['Entradas', 'Platos Fuertes', 'Postres', 'Bebidas'],
        message: 'Categoría no válida: {VALUE}',
      },
    },
    disponible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Plato = mongoose.model('Plato', platoSchema);

export default Plato;
