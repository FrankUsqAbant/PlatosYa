import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Plato from '../models/Plato.js';

// ─── Datos de semilla ────────────────────────────────────────

const usuarios = [
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

const platos = [
  // ── Entradas ──
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

  // ── Platos Fuertes ──
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

  // ── Postres ──
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

  // ── Bebidas ──
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

// ─── Script principal de semilla ─────────────────────────────

const seed = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB para seeding');

    // Limpiar colecciones existentes
    await User.deleteMany({});
    console.log('🗑️  Colección de usuarios limpiada');

    await Plato.deleteMany({});
    console.log('🗑️  Colección de platos limpiada');

    // Crear usuarios (las contraseñas se hashean automáticamente en el pre-save)
    const createdUsers = await User.create(usuarios);
    console.log(`👥 ${createdUsers.length} usuarios creados:`);
    createdUsers.forEach((u) => {
      console.log(`   - ${u.nombre} (${u.email}) - Rol: ${u.role}`);
    });

    // Crear platos
    const createdPlatos = await Plato.create(platos);
    console.log(`🍽️  ${createdPlatos.length} platos creados:`);
    createdPlatos.forEach((p) => {
      console.log(`   - ${p.nombre} ($${p.precio.toFixed(2)}) - ${p.categoria}`);
    });

    console.log('\n🌱 Seeding completado exitosamente!');
    console.log('\n📋 Credenciales de acceso:');
    console.log('   Cocinero: cocinero@platoya.com / cocinero123');
    console.log('   Cliente:  cliente@platoya.com / cliente123');
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  } finally {
    // Cerrar conexión
    await mongoose.disconnect();
    console.log('\n🔌 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

seed();
