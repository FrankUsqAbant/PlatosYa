// Middleware de autorización por rol
// Uso: requireRole('cocinero') o requireRole('cliente', 'cocinero')
const requireRole = (...roles) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Debe autenticarse primero.',
      });
    }

    // Verificar que el rol del usuario esté en la lista permitida
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}.`,
      });
    }

    next();
  };
};

export default requireRole;
