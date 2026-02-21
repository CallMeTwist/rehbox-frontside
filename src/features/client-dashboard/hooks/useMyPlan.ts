// src/features/client-dashboard/hooks/useMyPlan.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useMyPlan() {
  return useQuery({
    queryKey: ['client-plan'],
    queryFn: () => api.get('/client/plan').then((r) => r.data),
    retry: false, // Don't retry on 402 (unsubscribed)
  });
}