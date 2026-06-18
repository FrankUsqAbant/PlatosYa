import mongoose from 'mongoose';

// Conexión a la base de datos MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
