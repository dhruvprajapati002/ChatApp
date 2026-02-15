import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import Message from '../models/Message.js';

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { otherUserId } = req.params;
    const userId = req.userId;

    // Create conversation ID (consistent ordering)
    const conversationId = [userId, otherUserId].sort().join('_');

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(100);

    // Format messages for frontend
    const formattedMessages = messages.map(msg => ({
      conversationId: msg.conversationId,
      senderId: msg.senderId.toString(),
      receiverId: msg.receiverId.toString(),
      message: msg.message,
      timestamp: msg.createdAt,  // ✅ Use createdAt as timestamp
      status: msg.status
    }));

    res.json(formattedMessages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.userId;

    if (!receiverId || !message) {
      res.status(400).json({ message: 'Receiver ID and message are required' });
      return;
    }

    // Create conversation ID
    const conversationId = [senderId, receiverId].sort().join('_');

    const newMessage = await Message.create({
      conversationId,
      senderId,
      receiverId,
      message,
      status: 'sent'
    });

    res.status(201).json({
      conversationId: newMessage.conversationId,
      senderId: newMessage.senderId.toString(),
      receiverId: newMessage.receiverId.toString(),
      message: newMessage.message,
      timestamp: newMessage.createdAt,  // ✅ Use createdAt as timestamp
      status: newMessage.status
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;

    await Message.findByIdAndUpdate(messageId, { status: 'read' });

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
