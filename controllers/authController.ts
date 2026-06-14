import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';

export const authController = {
  // POST /api/auth/login
  processLogin: async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password wajib diisi.',
      });
    }

    try {
      const [rows]: any = await pool.query(
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

      // Save user to session
      const sessionUser = {
        id: user.id,
        username: user.username,
        role: user.role,
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
  processLogout: (req: Request, res: Response) => {
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
  getMe: (req: Request, res: Response) => {
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

export default authController;
