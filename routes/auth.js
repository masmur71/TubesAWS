// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isGuest } = require('../middleware/authMiddleware');

// GET /auth/login
router.get('/login', isGuest, authController.showLogin);

// POST /auth/login
router.post('/login', isGuest, authController.processLogin);

// POST /auth/logout (or GET for convenience)
router.get('/logout', authController.processLogout);
router.post('/logout', authController.processLogout);

module.exports = router;
