import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";

class SocketClient {
  private static instance: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

  static getInstance(): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (!this.instance) {
      this.instance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        transports: ["polling", "websocket"],  // polling first = reliable handshake, then upgrades to WS
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }
    return this.instance;
  }
}

export const socket = SocketClient.getInstance();