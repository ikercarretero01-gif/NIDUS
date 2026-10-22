'use client';

import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  unlock: (enteredPin: string) => Promise<{ success: boolean; error?: string }>;
  lock: () => Promise<void>;
  checkSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  errorMessage: null,

  checkSession: async () => {
    try {
      const res = await fetch('/api/auth/session', {
        method: 'GET',
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        const authenticated = Boolean(data.authenticated);
        set({ isAuthenticated: authenticated, isLoading: false });
        return authenticated;
      }
    } catch (err) {
      console.error('Error al comprobar sesión en servidor:', err);
    }
    set({ isAuthenticated: false, isLoading: false });
    return false;
  },

  unlock: async (enteredPin: string) => {
    set({ errorMessage: null });
    try {
      const res = await fetch('/api/auth/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        set({ isAuthenticated: true, errorMessage: null });
        return { success: true };
      }

      const errorMsg = data.error || 'PIN incorrecto';
      set({ errorMessage: errorMsg });
      return { success: false, error: errorMsg };
    } catch (err) {
      console.error('Error al validar PIN en servidor:', err);
      const errorMsg = 'Error de conexión con el servidor';
      set({ errorMessage: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  lock: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
    set({ isAuthenticated: false, errorMessage: null });
  },
}));
