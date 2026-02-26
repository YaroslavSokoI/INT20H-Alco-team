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
};
