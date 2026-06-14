// controllers/memberController.js
// Handles member (anggota kelompok) CRUD operations

const pool = require('../config/database');
const path = require('path');
const fs = require('fs');

const memberController = {
  // GET /members/:id - Show single member
  show: async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM members WHERE id = ? LIMIT 1',
        [req.params.id]
      );
      if (rows.length === 0) {
        req.flash('error', 'Anggota tidak ditemukan.');
        return res.redirect('/members');
      }
      res.render('members/detail', {
        title: `Profil ${rows[0].nama} - TUBES Komputasi Awan 2026`,
        member: rows[0],
        activePage: 'members',
      });
    } catch (err) {
      console.error('Member show error:', err);
      req.flash('error', 'Terjadi kesalahan server.');
      res.redirect('/members');
    }
  },


};

module.exports = memberController;
