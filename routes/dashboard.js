// routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// GET /dashboard
router.get('/', isAuthenticated, dashboardController.index);

// API endpoints (no auth required for load balancer health check)
router.get('/api/server-info', dashboardController.serverInfo);
router.get('/api/server-logs', isAuthenticated, dashboardController.serverLogs);

module.exports = router;
