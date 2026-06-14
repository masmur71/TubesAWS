// server.js
// Entry Point - TUGAS BESAR BBK3CAB3 - KOMPUTASI AWAN 2026
// Express.js Web Server with MySQL Database & Load Balancer Indicator

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_ID = process.env.SERVER_ID || '1';
const SERVER_NAME = process.env.SERVER_NAME || 'WebServer-Instance-1';

// ============================================================
// View Engine Configuration
// ============================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================
// Middleware Stack
// ============================================================
app.use(morgan('combined'));                            // HTTP logging
app.use(express.json());                               // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));       // Parse URL-encoded bodies
app.use(methodOverride('_method'));                    // Support PUT/DELETE via query string
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'tubesaws-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

app.use(flash());

// Attach global template variables (user, serverId, flash messages)
const { attachUser } = require('./middleware/authMiddleware');
app.use(attachUser);

// ============================================================
// Routes
// ============================================================
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/members', require('./routes/members'));

// Root redirect
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  res.redirect('/auth/login');
});

// Health check endpoint (for AWS Load Balancer health checks)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    serverId: SERVER_ID,
    serverName: SERVER_NAME,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================================
// 404 Error Handler
// ============================================================
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - Halaman Tidak Ditemukan',
    statusCode: 404,
    message: 'Halaman yang Anda cari tidak ditemukan.',
    activePage: '',
  });
});

// ============================================================
// Global Error Handler
// ============================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).render('error', {
    title: '500 - Server Error',
    statusCode: 500,
    message: 'Terjadi kesalahan pada server. Silakan coba lagi.',
    activePage: '',
  });
});

// ============================================================
// Start Server
// ============================================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('');

  console.log(`Server running on    : http://0.0.0.0:${PORT}`);

});

module.exports = app;
