import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket';

class SocketClient {
  private static instance: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

  static getInstance(): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (!this.instance) {
      this.instance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        transports: ['websocket'],
        autoConnect: false,
      });
    }
    return this.instance;
  }
}

export const socket = SocketClient.getInstance();
