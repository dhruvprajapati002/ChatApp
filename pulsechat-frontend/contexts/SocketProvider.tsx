'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '@/types/socket';
import { getStoredUser } from '@/lib/auth';

interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocketContext = () => useContext(SocketContext);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  const connectSocket = () => {
    const user = getStoredUser();
    if (!user?.id) return;

    // Already connected — don't create a duplicate socket
    if (socketRef.current?.connected) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

    const newSocket = io(socketUrl, {
      transports: ['polling', 'websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('user_online', user.id);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  useEffect(() => {
    // Try to connect immediately (handles page refresh when already logged in)
    connectSocket();

    // ✅ Listen for login/logout events dispatched by setAuth() and clearAuth()
    // 'auth-changed' is a custom event for same-tab changes
    // 'storage' is the native event for cross-tab changes
    const handleAuthChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.user) {
        connectSocket();
      } else {
        socketRef.current?.close();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' && e.newValue) connectSocket();
      if (e.key === 'user' && !e.newValue) {
        socketRef.current?.close();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };

    window.addEventListener('auth-changed', handleAuthChanged);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('auth-changed', handleAuthChanged);
      window.removeEventListener('storage', handleStorageChange);
      socketRef.current?.close();
    };
  }, []);


  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
