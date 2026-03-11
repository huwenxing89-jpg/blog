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
    set({ user: null, token: null, isLoading: false });
  },

  checkAuth: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const response = await request.get('/auth/me');
      set({ user: response.data, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
