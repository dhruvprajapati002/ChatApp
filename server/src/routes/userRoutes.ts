import express from 'express';
import { getMe, getAllUsers, updateOnlineStatus } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.get('/me', authMiddleware, getMe);
router.get('/all', authMiddleware, getAllUsers);
router.patch('/status', authMiddleware, updateOnlineStatus);

export default router;
