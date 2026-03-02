// src/features/pt-dashboard/hooks/usePTClients.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function usePTClients() {
  return useQuery({
    queryKey: ['pt-clients'],
    queryFn:  () => api.get('/pt/clients').then(r => r.data.clients),
  });
}