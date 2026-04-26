// src/features/client-dashboard/hooks/useRewards.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useIsFree } from '@/store/authStore';

export function useRewards() {
  const isFree = useIsFree();
  return useQuery({
    queryKey: ['client-rewards'],
    queryFn:  () => api.get('/client/rewards').then(r => r.data),
    enabled: !isFree,
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