'use client';

import { useEffect, useCallback } from 'react';
import { useSocketContext } from '@/contexts/SocketProvider';
import { MessagePayload, TypingPayload } from '@/types/socket';

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

  const onReceiveMessage = useCallback((callback: (data: MessagePayload) => void) => {
    if (!socket) return () => {};
    socket.on('receive_message', callback);
    return () => {
      socket.off('receive_message', callback);
    };
  }, [socket]);

  const onUserTyping = useCallback((callback: (data: TypingPayload) => void) => {
    if (!socket) return () => {};
    socket.on('user_typing', callback);
    return () => {
      socket.off('user_typing', callback);
    };
  }, [socket]);

  return {
    socket,  // ✅ Export socket
    isConnected,
    joinRoom,
    sendMessage,
    startTyping,
    stopTyping,
    onReceiveMessage,
    onUserTyping,
  };
};
