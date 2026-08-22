import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generar token JWT con payload de id y rol, expira en 7 días
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'platoya_secret_key_development_2026',
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

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanNombre = String(nombre).trim();

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del correo electrónico no es válido.',
      });
    }

    // Validar longitud de contraseña
    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres.',
      });
    }

    // Validar roles permitidos
    const allowedRoles = ['cliente', 'cocinero'];
    const assignedRole = allowedRoles.includes(role) ? role : 'cliente';

    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una cuenta con ese correo electrónico.',
      });
    }

    // Crear el usuario (el password se hashea en el pre-save hook)
    const user = await User.create({
      nombre: cleanNombre,
      email: cleanEmail,
      password: String(password),
      role: assignedRole,
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
      message: 'Error interno al registrar usuario.',
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

    const cleanEmail = String(email).trim().toLowerCase();

    // Buscar usuario por email
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
    }

    // Comparar contraseña
    const isMatch = await user.comparePassword(String(password));
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
      message: 'Error interno al iniciar sesión.',
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
    });
  }
};
