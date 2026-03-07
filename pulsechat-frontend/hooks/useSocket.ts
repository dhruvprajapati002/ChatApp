'use client';

import { useEffect, useCallback } from 'react';
import { useSocketContext } from '@/contexts/SocketProvider';
import { MessagePayload, TypingPayload, MessageReactionPayload, MessageStatusPayload } from '@/types/socket';

export const useSocket = () => {
  const { socket, isConnected } = useSocketContext();

  const joinRoom = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('join_room', conversationId);
    }
  }, [socket, isConnected]);

  const sendMessage = useCallback((data: MessagePayload) => {
    if (socket && isConnected) {
      socket.emit('send_message', data);
    }
  }, [socket, isConnected]);

  const startTyping = useCallback((data: TypingPayload) => {
    if (socket && isConnected) {
      socket.emit('typing', data);
    }
  }, [socket, isConnected]);

  const stopTyping = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('stop_typing', conversationId);
    }
  }, [socket, isConnected]);

  const addReaction = useCallback((data: MessageReactionPayload) => {
    if (socket && isConnected) {
      socket.emit('message_reaction', data);
    }
  }, [socket, isConnected]);

  const markMessagesRead = useCallback((data: { conversationId: string, receiverId: string }) => {
    if (socket && isConnected) {
      socket.emit('mark_messages_read', data);
    }
  }, [socket, isConnected]);

  const onReceiveMessage = useCallback((callback: (data: MessagePayload) => void) => {
    if (!socket) return () => { };
    socket.on('receive_message', callback);
    return () => {
      socket.off('receive_message', callback);
    };
  }, [socket]);

  const onUserTyping = useCallback((callback: (data: TypingPayload) => void) => {
    if (!socket) return () => { };
    socket.on('user_typing', callback);
    return () => {
      socket.off('user_typing', callback);
    };
  }, [socket]);

  const onMessageReaction = useCallback((callback: (data: MessageReactionPayload) => void) => {
    if (!socket) return () => { };
    socket.on('message_reaction', callback);
    return () => {
      socket.off('message_reaction', callback);
    };
  }, [socket]);

  const onMessagesStatusUpdate = useCallback((callback: (data: MessageStatusPayload) => void) => {
    if (!socket) return () => { };
    socket.on('messages_status_update', callback);
    return () => {
      socket.off('messages_status_update', callback);
    };
  }, [socket]);

  return {
    socket,  // ✅ Export socket
    isConnected,
    joinRoom,
    sendMessage,
    startTyping,
    stopTyping,
    addReaction,
    markMessagesRead,
    onReceiveMessage,
    onUserTyping,
    onMessageReaction,
    onMessagesStatusUpdate,
  };
};
