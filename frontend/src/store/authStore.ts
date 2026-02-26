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

const parseToken = (token: string): User | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return {
      id: payload.id.toString(),
      login: payload.login,
      role: payload.role
    };
  } catch (e) {
    console.error("Failed to parse token", e);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('token');
  const user = token ? parseToken(token) : null;
  
  return {
    user,
    users: [],
    isAuthenticated: !!token,
    token,

    login: async (loginName, password) => {
      try {
        const { token } = await authApi.login(loginName, password);
        localStorage.setItem('token', token);
        const user = parseToken(token);
        set({
          token,
          isAuthenticated: true,
          user,
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
