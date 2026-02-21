import { create } from 'zustand';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  timestamp: string;
}

interface UIState {
  sidebarOpen: boolean;
  language: string;
  notifications: Notification[];
  coinEarnAnimation: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setLanguage: (lang: string) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  triggerCoinAnimation: () => void;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'New client assigned', message: 'Amara Okonkwo has been assigned to you', type: 'info', read: false, timestamp: '5m ago' },
  { id: '2', title: 'Session completed', message: 'Chidi completed his knee exercises', type: 'success', read: false, timestamp: '1h ago' },
  { id: '3', title: 'Plan due', message: 'Exercise plan for Fatima expires tomorrow', type: 'warning', read: true, timestamp: '3h ago' },
];

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  language: 'en',
  notifications: mockNotifications,
  coinEarnAnimation: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setLanguage: (lang) => set({ language: lang }),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
    })),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),
  triggerCoinAnimation: () => {
    set({ coinEarnAnimation: true });
    setTimeout(() => set({ coinEarnAnimation: false }), 1000);
  },
}));
