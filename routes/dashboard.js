// routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// GET /api/dashboard/stats
router.get('/stats', isAuthenticated, dashboardController.getStats);

// GET /api/dashboard/server-logs
router.get('/server-logs', isAuthenticated, dashboardController.serverLogs);

module.exports = router;
