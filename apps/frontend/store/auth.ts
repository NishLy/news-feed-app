import { create } from "zustand";

interface AuthState {
  token: string | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;
}

export const authStore = create<AuthState>((set) => ({
  token: null,
  setAuth: (token) => set({ token }),
  clearAuth: () => set({ token: null }),
}));
