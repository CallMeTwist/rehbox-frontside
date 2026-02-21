import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'physiotherapist' | 'client';
export type VettingStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  vettingStatus?: VettingStatus;
  isSubscribed?: boolean;
  coins?: number;
  activationCode?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addCoins: (amount: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      addCoins: (amount) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, coins: (state.user.coins || 0) + amount }
            : null,
        })),
    }),
    { name: 'rehbox-auth' }
  )
);
