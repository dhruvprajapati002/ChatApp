import express from 'express';
import { getMessages, sendMessage, markAsRead } from '../controllers/messageController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/:otherUserId', authMiddleware, getMessages);
router.post('/', authMiddleware, sendMessage);
router.patch('/:messageId/read', authMiddleware, markAsRead);

export default router;
