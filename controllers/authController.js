// controllers/authController.js
// Handles login and logout logic

const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const authController = {
  // GET /auth/login
  showLogin: (req, res) => {
    res.render('auth/login', {
      title: 'Login - TUBES Komputasi Awan 2026',
      layout: false,
    });
  },

  // POST /auth/login
  processLogin: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      req.flash('error', 'Username dan password wajib diisi.');
      return res.redirect('/auth/login');
    }

    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ? LIMIT 1',
        [username.trim()]
      );

      if (rows.length === 0) {
        req.flash('error', 'Username atau password salah.');
        return res.redirect('/auth/login');
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        req.flash('error', 'Username atau password salah.');
        return res.redirect('/auth/login');
      }

      // Save user to session (exclude password)
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
        loginTime: new Date().toISOString(),
      };

      req.flash('success', `Selamat datang kembali, ${user.username}!`);
      return res.redirect('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      req.flash('error', 'Terjadi kesalahan server. Silakan coba lagi.');
      return res.redirect('/auth/login');
    }
  },

  // POST /auth/logout
  processLogout: (req, res) => {
    const username = req.session.user ? req.session.user.username : 'User';
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/auth/login');
    });
  },
};

module.exports = authController;
