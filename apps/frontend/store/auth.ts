import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;
}

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setAuth: (token) => set({ token }),
      clearAuth: () => set({ token: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
