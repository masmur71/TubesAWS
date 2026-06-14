// routes/serverInfo.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET /api/server-info — public endpoint for instance info
router.get('/', dashboardController.serverInfo);

module.exports = router;
