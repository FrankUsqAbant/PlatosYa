import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generar token JWT con payload de id y rol, expira en 7 días
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register - Registrar nuevo usuario
export const register = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;

    // Validar campos obligatorios
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son obligatorios.',
      });
    }

    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una cuenta con ese email.',
      });
    }

    // Crear el usuario (el password se hashea en el pre-save hook)
    const user = await User.create({
      nombre,
      email,
      password,
      role: role || 'cliente',
    });

    // Generar token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario.',
      error: error.message,
    });
  }
};

// POST /api/auth/login - Iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios.',
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
    }

    // Comparar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
    }

    // Generar token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión.',
      error: error.message,
    });
  }
};

// GET /api/auth/me - Obtener datos del usuario autenticado
export const getMe = async (req, res) => {
  try {
    // Buscar usuario por id, excluyendo el password
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.',
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos del usuario.',
      error: error.message,
    });
  }
};
