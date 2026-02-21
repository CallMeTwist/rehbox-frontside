// import axios from 'axios';

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.rehbox.ng/v1';

// export const apiClient = axios.create({
//   baseURL: BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
// });

// // Attach token to every request
// apiClient.interceptors.request.use((config) => {
//   const stored = localStorage.getItem('rehbox-auth');
//   if (stored) {
//     const parsed = JSON.parse(stored);
//     const token = parsed?.state?.token;
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Auth
// export const authApi = {
//   loginPT: (data: { email: string; password: string }) => apiClient.post('/auth/pt/login', data),
//   loginClient: (data: { email: string; password: string }) => apiClient.post('/auth/client/login', data),
//   registerPT: (data: object) => apiClient.post('/auth/pt/register', data),
//   registerClient: (data: object) => apiClient.post('/auth/client/register', data),
//   logout: () => apiClient.post('/auth/logout'),
// };

// // Physiotherapist
// export const ptApi = {
//   getProfile: () => apiClient.get('/pt/profile'),
//   updateProfile: (data: object) => apiClient.put('/pt/profile', data),
//   getClients: () => apiClient.get('/pt/clients'),
//   getClient: (id: string) => apiClient.get(`/pt/clients/${id}`),
//   createPlan: (data: object) => apiClient.post('/pt/plans', data),
//   getPlans: () => apiClient.get('/pt/plans'),
//   getStats: () => apiClient.get('/pt/stats'),
//   getCommissions: () => apiClient.get('/pt/commissions'),
//   getMessages: (clientId: string) => apiClient.get(`/pt/messages/${clientId}`),
//   sendMessage: (clientId: string, message: string) => apiClient.post(`/pt/messages/${clientId}`, { message }),
// };

// // Client
// export const clientApi = {
//   getProfile: () => apiClient.get('/client/profile'),
//   getPlan: () => apiClient.get('/client/plan'),
//   getSession: (exerciseId: string) => apiClient.get(`/client/session/${exerciseId}`),
//   submitSession: (data: object) => apiClient.post('/client/session/submit', data),
//   getProgress: () => apiClient.get('/client/progress'),
//   getRewards: () => apiClient.get('/client/rewards'),
//   redeemReward: (id: string) => apiClient.post(`/client/rewards/${id}/redeem`),
//   getShopItems: () => apiClient.get('/client/shop'),
//   subscribe: (plan: string) => apiClient.post('/client/subscribe', { plan }),
//   getChatMessages: (ptId: string) => apiClient.get(`/client/chat/${ptId}`),
//   sendMessage: (ptId: string, message: string) => apiClient.post(`/client/chat/${ptId}`, { message }),
//   getReminders: () => apiClient.get('/client/reminders'),
// };

// // Shared
// export const sharedApi = {
//   getExercises: () => apiClient.get('/exercises'),
//   getShopItems: () => apiClient.get('/shop'),
// };




import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rehbox_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rehbox_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;