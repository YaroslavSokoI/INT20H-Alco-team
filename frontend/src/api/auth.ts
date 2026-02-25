import apiClient from './client';
import type { User, UserRole } from '@/store/authStore';

export const authApi = {
  login: async (name: string, role: UserRole) => {
    // В реальності тут буде POST /auth/login або подібне
    const response = await apiClient.post('/login', { name, role });
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  createUser: async (userData: Omit<User, 'id'> & { password?: string }) => {
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  },
};
