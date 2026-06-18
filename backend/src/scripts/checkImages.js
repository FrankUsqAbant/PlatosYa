import 'dotenv/config';
import mongoose from 'mongoose';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const platos = await mongoose.connection.db.collection('platos').find({}, { projection: { nombre: 1, imagen: 1, categoria: 1 } }).toArray();
  platos.forEach(p => {
    const img = p.imagen ? p.imagen.substring(0, 70) : '--- SIN IMAGEN ---';
    console.log(`[${p.categoria}] ${p.nombre} => ${img}`);
  });
  await mongoose.disconnect();
}
main().catch(console.error);
