import { Server } from 'socket.io';
import Message from '../models/Message.js';
import User from '../models/User.js';
// Store online users in memory
const onlineUsers = new Map(); // userId -> socketId
export const initializeSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        console.log('✅ User connected:', socket.id);
        // Handle user login/presence
        socket.on('user_online', async (userId) => {
            try {
                console.log('👤 User came online:', userId);
                // Store user's socket ID
                onlineUsers.set(userId, socket.id);
                // Update database
                await User.findByIdAndUpdate(userId, {
                    isOnline: true,
                    lastSeen: new Date()
                });
                // Notify all clients about this user's online status
                io.emit('user_status_changed', {
                    userId,
                    isOnline: true
                });
                // Send list of all online users to the newly connected user
                const onlineUserIds = Array.from(onlineUsers.keys());
                socket.emit('online_users', onlineUserIds);
            }
            catch (error) {
                console.error('Error updating user online status:', error);
            }
        });
        socket.on('join_room', (conversationId) => {
            socket.join(conversationId);
            console.log(`User ${socket.id} joined room: ${conversationId}`);
        });
        socket.on('send_message', async (data) => {
            try {
                console.log('📥 Received message data:', data);
                if (!data.conversationId || !data.senderId || !data.receiverId || !data.message) {
                    console.error('❌ Missing required fields');
                    return;
                }
                const newMessage = await Message.create({
                    conversationId: data.conversationId,
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    message: data.message,
                    status: 'sent'
                });
                console.log('✅ Message saved:', newMessage._id);
                // Broadcast to room
                io.to(data.conversationId).emit('receive_message', {
                    conversationId: data.conversationId,
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    message: data.message,
                    timestamp: newMessage.createdAt
                });
            }
            catch (error) {
                console.error('❌ Error saving message:', error);
            }
        });
        socket.on('typing', (data) => {
            socket.to(data.conversationId).emit('user_typing', data);
        });
        socket.on('stop_typing', (conversationId) => {
            socket.to(conversationId).emit('user_stopped_typing', conversationId);
        });
        socket.on('disconnect', async () => {
            console.log('❌ User disconnected:', socket.id);
            // Find which user disconnected
            let disconnectedUserId = null;
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    onlineUsers.delete(userId);
                    break;
                }
            }
            if (disconnectedUserId) {
                try {
                    // Update database
                    await User.findByIdAndUpdate(disconnectedUserId, {
                        isOnline: false,
                        lastSeen: new Date()
                    });
                    // Notify all clients
                    io.emit('user_status_changed', {
                        userId: disconnectedUserId,
                        isOnline: false
                    });
                    console.log('👤 User went offline:', disconnectedUserId);
                }
                catch (error) {
                    console.error('Error updating user offline status:', error);
                }
            }
        });
    });
    return io;
};
