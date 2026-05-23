import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and potentially redirect or re-auth
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  loginWithTelegram: (initData) => api.post('/auth/telegram', { init_data: initData }),
};

export const examApi = {
  listExams: (params) => api.get('/exams/', { params }),
  getExamDetail: (examId) => api.get(`/exams/${examId}`),
  syncAttempt: (data) => api.post('/attempts/sync', data),
};

export const userApi = {
  getProfile: () => api.get('/users/me'),
  getStats: () => api.get('/users/me/stats'),
};

export const paymentApi = {
  getPlans: () => api.get('/admin/plans'), // Using admin endpoint for plans for now, or move to public
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
