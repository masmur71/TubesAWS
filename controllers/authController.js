// controllers/authController.js
// Handles login and logout logic (REST API)

const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const authController = {
  // POST /api/auth/login
  processLogin: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password wajib diisi.',
      });
    }

    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ? LIMIT 1',
        [username.trim()]
      );

      if (rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Username atau password salah.',
        });
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Username atau password salah.',
        });
      }

      // Save user to session (exclude password)
      const sessionUser = {
        id: user.id,
        username: user.username,
        role: user.role,
        loginTime: new Date().toISOString(),
      };
      req.session.user = sessionUser;

      return res.json({
        success: true,
        message: `Selamat datang kembali, ${user.username}!`,
        user: sessionUser,
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server. Silakan coba lagi.',
      });
    }
  },

  // POST /api/auth/logout
  processLogout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({
          success: false,
          message: 'Gagal logout.',
        });
      }
      res.clearCookie('connect.sid');
      return res.json({
        success: true,
        message: 'Berhasil logout.',
      });
    });
  },

  // GET /api/auth/me
  getMe: (req, res) => {
    if (req.session && req.session.user) {
      return res.json({
        success: true,
        user: req.session.user,
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Belum login.',
    });
  },
};

module.exports = authController;
