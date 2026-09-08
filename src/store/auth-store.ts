'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  pin: string;
  unlock: (enteredPin: string) => boolean;
  lock: () => void;
  setPin: (newPin: string) => void;
}

export const DEFAULT_PIN = process.env.NEXT_PUBLIC_OWNER_PIN || '9891';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      pin: DEFAULT_PIN,

      unlock: (enteredPin: string) => {
        const correctPin = get().pin || DEFAULT_PIN;
        if (enteredPin === correctPin) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      lock: () => {
        set({ isAuthenticated: false });
      },

      setPin: (newPin: string) => {
        set({ pin: newPin });
      },
    }),
    {
      name: 'nidus-auth',
    }
  )
);
