export interface MessagePayload {
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date | string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface TypingPayload {
  conversationId: string;
  userId: string;
  username: string;
}

export interface UserStatusPayload {
  userId: string;
  isOnline: boolean;
}

export interface ServerToClientEvents {
  receive_message: (data: MessagePayload) => void;
  user_typing: (data: TypingPayload) => void;
  user_stopped_typing: (conversationId: string) => void;
  user_status_changed: (data: UserStatusPayload) => void;  // ✅ NEW
  online_users: (userIds: string[]) => void;  // ✅ NEW
  message_read: (messageId: string) => void;
}

export interface ClientToServerEvents {
  send_message: (data: MessagePayload) => void;
  join_room: (conversationId: string) => void;
  leave_room: (conversationId: string) => void;
  typing: (data: TypingPayload) => void;
  stop_typing: (conversationId: string) => void;
  mark_as_read: (messageId: string) => void;
  user_online: (userId: string) => void;  // ✅ NEW
}
