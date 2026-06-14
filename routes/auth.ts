import express from 'express';
import authController from '../controllers/authController';

const router = express.Router();

// POST /api/auth/login
router.post('/login', authController.processLogin);

// POST /api/auth/logout
router.post('/logout', authController.processLogout);

// GET /api/auth/me — check current session
router.get('/me', authController.getMe);

export default router;
