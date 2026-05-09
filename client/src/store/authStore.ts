import { create } from 'zustand';
import type { User, AuthResponse } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialize: () => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      set({ user: JSON.parse(savedUser), loading: false });
    } else {
      set({ loading: false });
    }
  },
  login: (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ user: data.user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null });
  },
}));
