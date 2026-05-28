// src/features/client-dashboard/hooks/useProgress.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useProgress(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['client-progress'],
    queryFn:  () => api.get('/client/progress').then(r => r.data),
    enabled:  options?.enabled ?? true,
  });
}

export function useMonthlyReport(month: number, year: number) {
  return useQuery({
    queryKey: ['monthly-report', month, year],
    queryFn:  () => api.get(`/client/progress/report/${month}/${year}`).then(r => r.data),
  });
}