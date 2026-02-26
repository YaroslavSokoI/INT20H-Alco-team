import { create } from "zustand";
import { authApi } from "@/api/auth";

export type UserRole = "admin" | "manager";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('token');
  
  return {
    user: token ? { id: "self", name: "admin", role: "admin" } : null,
    isAuthenticated: !!token,
    token,

    login: async (loginName, password) => {
      try {
        const { token } = await authApi.login(loginName, password);
        localStorage.setItem('token', token);
        set({
          token,
          isAuthenticated: true,
          // Тимчасово встановлюємо мінімального користувача для UI
          user: { id: "self", name: loginName, role: "admin" },
        });
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, token: null });
    },
  };
});
