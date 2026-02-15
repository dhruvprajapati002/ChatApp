export interface MessagePayload {
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date | string;  // ✅ Can be Date or ISO string
  status?: 'sent' | 'delivered' | 'read';  // ✅ Optional status
}

export interface TypingPayload {
  conversationId: string;
  userId: string;
  username: string;
}

export interface ServerToClientEvents {
  receive_message: (data: MessagePayload) => void;
  user_typing: (data: TypingPayload) => void;
  user_stopped_typing: (conversationId: string) => void;
  user_online: (userId: string) => void;
  user_offline: (userId: string) => void;
  message_read: (messageId: string) => void;
}

export interface ClientToServerEvents {
  send_message: (data: MessagePayload) => void;
  join_room: (conversationId: string) => void;
  leave_room: (conversationId: string) => void;
  typing: (data: TypingPayload) => void;
  stop_typing: (conversationId: string) => void;
  mark_as_read: (messageId: string) => void;
}
