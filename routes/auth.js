// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', authController.processLogin);

// POST /api/auth/logout
router.post('/logout', authController.processLogout);

// GET /api/auth/me — check current session
router.get('/me', authController.getMe);

module.exports = router;
