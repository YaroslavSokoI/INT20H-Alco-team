import { create } from "zustand";

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
    // В майбутньому тут буде axios.post('/api/login')
    set({ user: { id: "1", name, role }, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  createUser: async (userData) => {
    // В майбутньому тут буде axios.post('/api/users', userData)
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
    };
    set((state) => ({ users: [...state.users, newUser] }));
  },

  fetchUsers: async () => {
    // В майбутньому тут буде axios.get('/api/users')
    // Емуляція затримки для демонстрації скелетонів
    await new Promise((resolve) => setTimeout(resolve, 600));
  },
}));
