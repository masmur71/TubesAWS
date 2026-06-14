// controllers/memberController.js
// Handles member (anggota kelompok) operations (REST API)

const pool = require('../config/database');

const memberController = {
  // GET /api/members - List all members
  index: async (req, res) => {
    try {
      const [members] = await pool.query('SELECT * FROM members ORDER BY id ASC');
      return res.json({
        success: true,
        members,
      });
    } catch (err) {
      console.error('Members list error:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server.',
      });
    }
  },

  // GET /api/members/:id - Show single member
  show: async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM members WHERE id = ? LIMIT 1',
        [req.params.id]
      );
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Anggota tidak ditemukan.',
        });
      }
      return res.json({
        success: true,
        member: rows[0],
      });
    } catch (err) {
      console.error('Member show error:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server.',
      });
    }
  },
};

module.exports = memberController;
