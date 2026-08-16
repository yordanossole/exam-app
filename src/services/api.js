import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stan-care-discrete-camcorders.trycloudflare.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear token and potentially redirect or re-auth
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  loginWithTelegram: (initData) => api.post('/auth/telegram', { init_data: initData }),
};

export const userApi = {
  getProfile: () => api.get('/users/me'),
};

export const paymentApi = {
  getPlans: () => axios.get('/api/plans'),
  submitPayment: (data) => api.post('/payments/', data),
  uploadProof: (paymentId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/payments/${paymentId}/proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
