// src/features/pt-dashboard/hooks/usePTDashboard.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function usePTDashboard() {
  return useQuery({
    queryKey: ['pt-dashboard'],
    queryFn:  () => api.get('/pt/dashboard').then(r => r.data),
  });
}