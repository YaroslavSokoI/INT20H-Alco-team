import apiClient from './client';

export interface AuthResponse {
  token: string;
}

export const authApi = {
  login: async (login: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', { login, password });
    return response.data;
  },
  register: async (userData: any): Promise<any> => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },
  updateSelf: async (userData: { login?: string; password?: string; currentPassword?: string }): Promise<any> => {
    const response = await apiClient.patch('/users/me', userData);
    return response.data;
  },
  updateUser: async (id: string | number, userData: { login?: string; password?: string; currentPassword?: string }): Promise<any> => {
    const response = await apiClient.patch(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
