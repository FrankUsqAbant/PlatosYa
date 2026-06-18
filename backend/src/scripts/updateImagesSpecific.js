import 'dotenv/config';
import mongoose from 'mongoose';
import Plato from '../models/Plato.js';

const imagesMap = {
  // Entradas
  'Bruschetta Mediterránea': 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80',
  'Ceviche Clásico': 'https://images.unsplash.com/photo-1590847926861-1271f267dc54?auto=format&fit=crop&w=800&q=80',
  'Tabla de Quesos Artesanales': 'https://images.unsplash.com/photo-1631379578550-7038263db699?auto=format&fit=crop&w=800&q=80',

  // Platos Fuertes
  'Lomo Saltado': 'https://images.unsplash.com/photo-1606850239616-e5c9429eb10c?auto=format&fit=crop&w=800&q=80',
  'Risotto de Hongos': 'https://images.unsplash.com/photo-1633964913295-ceb43826e7cf?auto=format&fit=crop&w=800&q=80',
  'Salmón a la Parrilla': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
  'Pollo al Curry Thai': 'https://images.unsplash.com/photo-1565557613262-e1c4113eb7d8?auto=format&fit=crop&w=800&q=80',

  // Postres
  'Tiramisú Clásico': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80',
  'Cheesecake de Frutos Rojos': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
  'Volcán de Chocolate': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',

  // Bebidas
  'Limonada de Maracuyá': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  'Smoothie Tropical': 'https://images.unsplash.com/photo-1610970881699-44a5587ce572?auto=format&fit=crop&w=800&q=80',
};

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB para actualizar imágenes específicas');

    for (const [nombre, url] of Object.entries(imagesMap)) {
      await Plato.updateOne({ nombre }, { $set: { imagen: url } });
      console.log(`Actualizado: ${nombre}`);
    }

    console.log('🖼️ Todas las imágenes se han asignado correctamente');
  } catch (error) {
    console.error('❌ Error al actualizar imágenes:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateImages();
