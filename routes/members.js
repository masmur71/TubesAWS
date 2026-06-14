// routes/members.js
const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// GET /api/members — List all members
router.get('/', isAuthenticated, memberController.index);

// GET /api/members/:id — Show single member
router.get('/:id', isAuthenticated, memberController.show);

module.exports = router;
