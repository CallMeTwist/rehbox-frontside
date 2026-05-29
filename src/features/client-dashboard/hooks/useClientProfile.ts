// src/features/client-dashboard/hooks/useClientProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

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

export function useUploadClientAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append('avatar', file);
      return api.post('/client/profile/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: (res) => {
      useAuthStore.getState().updateUser({ avatar_url: res.data.avatar_url });
      qc.invalidateQueries({ queryKey: ['client-profile'] });
    },
  });
}