import 'dotenv/config';
import mongoose from 'mongoose';
import Plato from '../models/Plato.js';

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB para actualizar imágenes');

    const resultEntradas = await Plato.updateMany({ categoria: 'Entradas' }, { $set: { imagen: '/images/entradas.png' } });
    console.log(`Entradas actualizadas: ${resultEntradas.modifiedCount}`);

    const resultFuertes = await Plato.updateMany({ categoria: 'Platos Fuertes' }, { $set: { imagen: '/images/fuertes.png' } });
    console.log(`Platos Fuertes actualizados: ${resultFuertes.modifiedCount}`);

    const resultPostres = await Plato.updateMany({ categoria: 'Postres' }, { $set: { imagen: '/images/postres.png' } });
    console.log(`Postres actualizados: ${resultPostres.modifiedCount}`);

    const resultBebidas = await Plato.updateMany({ categoria: 'Bebidas' }, { $set: { imagen: '/images/bebidas.png' } });
    console.log(`Bebidas actualizadas: ${resultBebidas.modifiedCount}`);

    console.log('🖼️ Imágenes actualizadas exitosamente');
  } catch (error) {
    console.error('❌ Error al actualizar imágenes:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateImages();
