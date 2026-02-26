import { create } from "zustand";
import { authApi } from "@/api/auth";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  token: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUsers: () => Promise<void>;
  createUser: (userData: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('token');
  
  return {
    user: token ? { id: "self", name: "admin", role: "admin" } : null,
    users: [],
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
      set({ user: null, isAuthenticated: false, token: null, users: [] });
    },

    fetchUsers: async () => {
      // Тимчасово для тестування, якщо API ще не готове
      const mockUsers: User[] = [
        { id: "1", name: "Admin User", role: "admin" },
        { id: "2", name: "Manager User", role: "manager" },
      ];
      set({ users: mockUsers });
    },

    createUser: async (userData) => {
      // Тимчасово для тестування
      console.log("Creating user:", userData);
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        role: userData.role,
      };
      set((state) => ({ users: [...state.users, newUser] }));
    }
  };
});
