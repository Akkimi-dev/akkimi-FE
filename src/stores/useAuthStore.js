import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,

      setTokens: (accessToken, refreshToken) => {
        set({
          isLoggedIn: true,
          accessToken,
          refreshToken,
        });
      },

      clearAuth: () => {
        set({
          isLoggedIn: false,
          accessToken: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: 'auth-storage', // key in localStorage
    }
  )
);
