// src/features/client-dashboard/hooks/useRewards.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useRewards() {
  return useQuery({
    queryKey: ['client-rewards'],
    queryFn:  () => api.get('/client/rewards').then(r => r.data),
  });
}

export function useShop(category?: string) {
  return useQuery({
    queryKey: ['shop', category],
    queryFn:  () => api.get('/client/shop', {
      params: category ? { category } : {},
    }).then(r => r.data),
  });
}