// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';

// interface AuthUser {
//   id: number;
//   name: string;
//   email: string;
//   role: 'pt' | 'client';
//   vetting_status?: 'pending' | 'approved' | 'rejected';
//   subscription_status?: 'inactive' | 'active' | 'expired';
//   activation_code?: string;
//   coin_balance?: number;
// }

// interface AuthState {
//   user: AuthUser | null;
//   token: string | null;
//   setAuth: (user: AuthUser, token: string) => void;
//   updateUser: (updates: Partial<AuthUser>) => void;
//   logout: () => void;
//   isAuthenticated: () => boolean;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       user:  null,
//       token: null,

//       setAuth: (user, token) => {
//         set({ user, token });
//         // ✅ No more manual localStorage.setItem — persist handles it
        
//       },

//       updateUser: (updates) =>
//         set((state) => ({
//           user: state.user ? { ...state.user, ...updates } : null,
//         })),

//       logout: () => {
//         set({ user: null, token: null });
//         // ✅ Persist middleware clears sessionStorage automatically
//       },

//       isAuthenticated: () => !!get().token && !!get().user,
//     }),
//     {
//       name:    'rehbox-auth',
//       storage: createJSONStorage(() => sessionStorage), // ← tab-isolated
//       partialize: (state) => ({ user: state.user, token: state.token }),
//     }
//   )
// );


// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'pt' | 'client';
  client_id?: number;
  vetting_status?: 'pending' | 'approved' | 'rejected';
  subscription_status?: 'inactive' | 'active' | 'expired';
  activation_code?: string;
  coin_balance?: number;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:  null,
      token: null,

      setAuth: (user, token) => {
        set({ user, token });
        // Reset Echo so it picks up the new token
        import('@/features/shared/utils/echo').then((m) => m.resetEcho());
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      logout: () => {
        set({ user: null, token: null });
        // Reset Echo on logout too
        import('@/features/shared/utils/echo').then((m) => m.resetEcho());
      },

      isAuthenticated: () => !!get().token && !!get().user,
    }),
    {
      name:    'rehbox-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);