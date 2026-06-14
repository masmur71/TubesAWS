import express from 'express';
import dashboardController from '../controllers/dashboardController';

const router = express.Router();

// GET /api/server-info — public endpoint for instance info
router.get('/', dashboardController.serverInfo);

export default router;
