// middleware/authMiddleware.js
// Authentication & Authorization Middleware (REST API)

const authMiddleware = {
  // Check if user is authenticated
  isAuthenticated: (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    return res.status(401).json({
      success: false,
      message: 'Silakan login terlebih dahulu untuk mengakses halaman ini.',
    });
  },

  // Check if user is admin
  isAdmin: (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya admin yang dapat mengakses halaman ini.',
    });
  },
};

module.exports = authMiddleware;
