// src/lib/api.ts
import axios from 'axios';

// ✅ Single axios instance — used everywhere
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
});

// Attach Bearer token from Zustand persisted store
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('rehbox-auth');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const token  = parsed?.state?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore malformed storage
    }
  }
  return config;
});

// Redirect to login on expired token
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rehbox-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Named API helpers (all use the same instance above) ──────────────

export const authApi = {
  loginPT:        (data: { email: string; password: string }) => api.post('/auth/pt/login', data),
  loginClient:    (data: { email: string; password: string }) => api.post('/auth/client/login', data),
  registerPT:     (data: FormData) =>
    api.post('/auth/pt/register', data),
  registerClient: (data: object) => api.post('/auth/client/register', data),
  logout:         () => api.post('/auth/logout'),
};

export const ptApi = {
  getProfile:     () => api.get('/pt/profile'),
  updateProfile:  (data: object) => api.put('/pt/profile', data),
  getClients:     () => api.get('/pt/clients'),
  getClient:      (id: string) => api.get(`/pt/clients/${id}`),
  getExercises:   (params?: object) => api.get('/pt/exercises', { params }),
  createPlan:     (data: object) => api.post('/pt/plans', data),
  updatePlan:     (id: number, data: object) => api.put(`/pt/plans/${id}`, data),
  deletePlan:     (id: number) => api.delete(`/pt/plans/${id}`),
  getStats:       () => api.get('/pt/stats'),
  getCommissions: () => api.get('/pt/commissions'),
};

export const clientApi = {
  getProfile:   () => api.get('/client/profile'),
  getPlan:      () => api.get('/client/plan'),
  getProgress:  () => api.get('/client/progress'),
  getRewards:   () => api.get('/client/rewards'),
  redeemReward: (id: string) => api.post(`/client/rewards/${id}/redeem`),
  getShopItems: () => api.get('/client/shop'),
  subscribe:    (plan: string) => api.post('/client/subscribe', { plan }),
  submitSession:(data: object) => api.post('/client/session/submit', data),
  getChatMessages: (ptId: string) => api.get(`/client/chat/${ptId}`),
  sendMessage:  (ptId: string, message: string) => api.post(`/client/chat/${ptId}`, { message }),
};