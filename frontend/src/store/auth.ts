import { create } from 'zustand';
import request from '@/lib/request';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// 从 URL 参数读取 token（用于 iframe 跨域 token 共享）
function getTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('_token');
  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl);
    // 清理 URL 中的 token 参数
    urlParams.delete('_token');
    const newUrl = urlParams.toString()
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
    return tokenFromUrl;
  }
  return null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: true,

  login: async (email: string, password: string) => {
    const response = await request.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    set({ user, token, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    set({ user: null, token: null, isLoading: false });
  },

  checkAuth: async () => {
    // 先尝试从 URL 参数获取 token
    const urlToken = getTokenFromUrl();
    const token = urlToken || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const response = await request.get('/auth/me');
      set({ user: response.data, token, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
