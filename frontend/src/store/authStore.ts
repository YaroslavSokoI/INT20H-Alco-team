import { create } from "zustand";
import { authApi } from "@/api/auth";
import apiClient from "@/api/client";
import type {User} from "@/types/user";

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
    user: token ? { id: "self", login: "admin", role: "admin" } : null,
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
          user: { id: "self", login: loginName, role: "admin" },
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
      try {
        const response = await apiClient.get<User[]>('/users');
        set({ users: response.data });
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    },

    createUser: async (userData) => {
      try {
        const newUser = await authApi.register(userData);
        set((state) => ({ users: [...state.users, newUser] }));
      } catch (error) {
        console.error("Failed to create user:", error);
        throw error;
      }
    }
  };
});
