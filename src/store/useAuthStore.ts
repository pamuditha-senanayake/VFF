import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, role) => 
        set({ 
          user: { id: '1', name: 'Demo User', email, role }, 
          isAuthenticated: true 
        }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setRole: (role) => 
        set((state) => ({
          user: state.user ? { ...state.user, role } : null
        })),
    }),
    {
      name: 'vff-auth-storage',
    }
  )
);
