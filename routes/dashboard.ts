import express from 'express';
import dashboardController from '../controllers/dashboardController';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', isAuthenticated, dashboardController.getStats);

// GET /api/dashboard/server-logs
router.get('/server-logs', isAuthenticated, dashboardController.serverLogs);

export default router;
