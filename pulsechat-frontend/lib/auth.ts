import { User } from '@/types/user';

export const setAuth = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  // Notify SocketProvider in the same tab (storage event only fires in OTHER tabs)
  window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user } }));
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    return user;
  } catch (error) {
    console.error('❌ Error parsing user from localStorage:', error);
    return null;
  }
};
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Notify SocketProvider in the same tab
  window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user: null } }));
};

export const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};
