import express from 'express';
import memberController from '../controllers/memberController';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

// GET /api/members — List all members
router.get('/', isAuthenticated, memberController.index);

// GET /api/members/:id — Show single member
router.get('/:id', isAuthenticated, memberController.show);

export default router;
