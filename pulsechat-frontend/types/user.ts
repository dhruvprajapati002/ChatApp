export interface User {
  id?: string;      // Frontend uses this
  _id?: string;     // Backend might send this
  username: string;
  email: string;
  isOnline?: boolean;
  lastSeen?: Date;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
