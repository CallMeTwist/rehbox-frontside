// src/features/pt-dashboard/hooks/usePTProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function usePTProfile() {
  return useQuery({
    queryKey: ['pt-profile'],
    queryFn:  () => api.get('/pt/profile').then(r => r.data),
  });
}

export function useUpdatePTProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, string>) => api.patch('/pt/profile', data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['pt-profile'] }),
  });
}