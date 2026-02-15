import { User } from '@/types/user';

export const setAuth = (token: string, user: User) => {
  console.log('💾 Storing auth data:', { token: token.substring(0, 20) + '...', user });
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    console.log('📦 Retrieved user from storage:', user);
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
};

export const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};
