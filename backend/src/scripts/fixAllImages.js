import 'dotenv/config';
import mongoose from 'mongoose';

// URLs de Pexels CDN - sin restricciones de hotlink, perfectas para apps
const platosImages = {
  // Entradas
  'Bruschetta Mediterránea': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Ceviche Clásico':         'https://images.pexels.com/photos/566344/pexels-photo-566344.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Tabla de Quesos Artesanales': 'https://images.pexels.com/photos/1927377/pexels-photo-1927377.jpeg?auto=compress&cs=tinysrgb&w=800',

  // Platos Fuertes
  'Lomo Saltado':        'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Risotto de Hongos':   'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Salmón a la Parrilla':'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Pollo al Curry Thai': 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800',

  // Postres
  'Tiramisú Clásico':          'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Cheesecake de Frutos Rojos':'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Volcán de Chocolate':       'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=800',

  // Bebidas
  'Limonada de Maracuyá': 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Smoothie Tropical':    'https://images.pexels.com/photos/3738730/pexels-photo-3738730.jpeg?auto=compress&cs=tinysrgb&w=800',
};

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Conectado a MongoDB');

  for (const [nombre, url] of Object.entries(platosImages)) {
    const result = await mongoose.connection.db.collection('platos').updateOne(
      { nombre },
      { $set: { imagen: url } }
    );
    const status = result.matchedCount > 0 ? '✓' : '✗ NOT FOUND';
    console.log(`${status} ${nombre}`);
  }

  console.log('\n🖼️  Imágenes actualizadas con Pexels CDN (sin restricciones)');
  await mongoose.disconnect();
}

main().catch(console.error);
