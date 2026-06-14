// middleware/authMiddleware.js
// Authentication & Authorization Middleware

const authMiddleware = {
  // Check if user is authenticated
  isAuthenticated: (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    req.flash('error', 'Silakan login terlebih dahulu untuk mengakses halaman ini.');
    return res.redirect('/auth/login');
  },

  // Check if user is admin
  isAdmin: (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    req.flash('error', 'Akses ditolak. Hanya admin yang dapat mengakses halaman ini.');
    return res.redirect('/dashboard');
  },

  // Check if already logged in (redirect to dashboard)
  isGuest: (req, res, next) => {
    if (req.session && req.session.user) {
      return res.redirect('/dashboard');
    }
    return next();
  },

  // Attach user to all views
  attachUser: (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.serverId = process.env.SERVER_ID || '1';
    res.locals.serverName = process.env.SERVER_NAME || 'WebServer-Instance-1';
    res.locals.flashSuccess = req.flash('success');
    res.locals.flashError = req.flash('error');
    next();
  }
};

module.exports = authMiddleware;
