// src/features/client-dashboard/hooks/useClientProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useClientProfile() {
  return useQuery({
    queryKey: ['client-profile'],
    queryFn:  () => api.get('/client/profile').then(r => r.data),
  });
}

export function useUpdateClientProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; phone?: string }) => api.patch('/client/profile', data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['client-profile'] }),
  });
}