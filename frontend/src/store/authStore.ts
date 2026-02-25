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
  users: User[];
  isAuthenticated: boolean;
  login: (name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  createUser: (userData: Omit<User, "id"> & { password?: string }) => Promise<void>;
  fetchUsers: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: { id: "1", name: "Admin User", role: "admin" }, // Mocked initial user for dev
  users: [
    { id: "1", name: "Admin User", role: "admin" },
    { id: "2", name: "Manager One", role: "manager" },
  ],
  isAuthenticated: true,

  login: async (name, role) => {
    try {
      // Приклад використання:
      // const user = await authApi.login(name, role);
      console.log("Auth API available:", !!authApi);
      
      set({ user: { id: "1", name, role }, isAuthenticated: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('token');
  },

  createUser: async (userData) => {
    try {
      // const newUser = await authApi.createUser(userData);
      // set((state) => ({ users: [...state.users, newUser] }));

      // Mock implementation
      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
      };
      set((state) => ({ users: [...state.users, newUser] }));
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  },

  fetchUsers: async () => {
    try {
      // const users = await authApi.getUsers();
      // set({ users });

      // Емуляція затримки для демонстрації скелетонів
      await new Promise((resolve) => setTimeout(resolve, 600));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  },
}));
