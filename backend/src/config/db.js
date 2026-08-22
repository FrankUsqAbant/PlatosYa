import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User.js';
import Plato from '../models/Plato.js';

const initialUsers = [
  {
    nombre: 'Chef Mario',
    email: 'cocinero@platoya.com',
    password: 'cocinero123',
    role: 'cocinero',
  },
  {
    nombre: 'Juan Cliente',
    email: 'cliente@platoya.com',
    password: 'cliente123',
    role: 'cliente',
  },
];

const initialPlatos = [
  {
    nombre: 'Bruschetta Mediterránea',
    descripcion: 'Pan tostado con tomate fresco, albahaca y aceite de oliva',
    precio: 8.50,
    imagen: '/images/bruschetta.webp',
    categoria: 'Entradas',
    disponible: true,
  },
  {
    nombre: 'Ceviche Clásico',
    descripcion: 'Pescado fresco marinado en limón con cebolla morada y cilantro',
    precio: 12.00,
    imagen: '/images/ceviche.webp',
    categoria: 'Entradas',
    disponible: true,
  },
  {
    nombre: 'Tabla de Quesos Artesanales',
    descripcion: 'Selección de quesos finos con frutos secos y mermelada',
    precio: 15.00,
    imagen: '/images/quesos.webp',
    categoria: 'Entradas',
    disponible: true,
  },
  {
    nombre: 'Lomo Saltado',
    descripcion: 'Tiras de lomo fino salteadas con cebolla, tomate y papas fritas',
    precio: 18.50,
    imagen: '/images/lomo_saltado.webp',
    categoria: 'Platos Fuertes',
    disponible: true,
  },
  {
    nombre: 'Risotto de Hongos',
    descripcion: 'Arroz arborio cremoso con mix de hongos silvestres y parmesano',
    precio: 16.00,
    imagen: '/images/risotto.webp',
    categoria: 'Platos Fuertes',
    disponible: true,
  },
  {
    nombre: 'Salmón a la Parrilla',
    descripcion: 'Filete de salmón con salsa de maracuyá y vegetales grillados',
    precio: 22.00,
    imagen: '/images/salmon.webp',
    categoria: 'Platos Fuertes',
    disponible: true,
  },
  {
    nombre: 'Pollo al Curry Thai',
    descripcion: 'Pechuga de pollo en salsa curry thai con arroz jazmín',
    precio: 15.50,
    imagen: '/images/curry_thai.webp',
    categoria: 'Platos Fuertes',
    disponible: true,
  },
  {
    nombre: 'Tiramisú Clásico',
    descripcion: 'Capas de bizcocho, mascarpone y café espresso',
    precio: 9.00,
    imagen: '/images/tiramisu.webp',
    categoria: 'Postres',
    disponible: true,
  },
  {
    nombre: 'Cheesecake de Frutos Rojos',
    descripcion: 'Cheesecake cremoso con coulis de frutos rojos',
    precio: 10.00,
    imagen: '/images/cheesecake.webp',
    categoria: 'Postres',
    disponible: true,
  },
  {
    nombre: 'Volcán de Chocolate',
    descripcion: 'Bizcocho de chocolate con centro fundido y helado de vainilla',
    precio: 11.00,
    imagen: '/images/volcan_chocolate.webp',
    categoria: 'Postres',
    disponible: true,
  },
  {
    nombre: 'Limonada de Maracuyá',
    descripcion: 'Limonada fresca con pulpa de maracuyá y hierbabuena',
    precio: 5.00,
    imagen: '/images/limonada_maracuya.webp',
    categoria: 'Bebidas',
    disponible: true,
  },
  {
    nombre: 'Smoothie Tropical',
    descripcion: 'Mango, piña, banana y leche de coco',
    precio: 7.00,
    imagen: '/images/smoothie_tropical.webp',
    categoria: 'Bebidas',
    disponible: true,
  },
];

const autoSeedIfEmpty = async () => {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('🌱 Inicializando datos semilla en MongoDB...');
    await User.create(initialUsers);
    await Plato.create(initialPlatos);
    console.log('✅ Datos semilla creados con éxito (usuarios y platos iniciales listos)');
  }
};

// Conexión a la base de datos MongoDB (con soporte para MongoMemoryServer)
const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri || uri === 'memory' || uri.trim() === '') {
      console.log('📦 Iniciando MongoDB en memoria (mongodb-memory-server)...');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);

    await autoSeedIfEmpty();
  } catch (error) {
    console.error(`❌ Error de conexión MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
