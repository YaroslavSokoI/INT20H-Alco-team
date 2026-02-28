import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token interceptor
apiClient.interceptors.request.use((config) => {
  const authStorageStr = localStorage.getItem('auth-storage');
  if (authStorageStr) {
    try {
      const authData = JSON.parse(authStorageStr);
      const token = authData?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Failed to parse auth token from local storage', e);
    }
  }
  return config;
});

export default apiClient;
