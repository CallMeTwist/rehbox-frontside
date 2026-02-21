// src/features/pt-dashboard/hooks/useClients.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface PTClient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  primary_condition?: string;
  subscription_status: string;
  coin_balance: number;
  compliance_rate: number;
  active_plan_title?: string;
  last_session?: string;
}

export function useClients() {
  return useQuery({
    queryKey: ['pt-clients'],
    queryFn: () => api.get('/pt/clients').then((r) => r.data),
  });
}

export function useClientDetail(clientId: number) {
  return useQuery({
    queryKey: ['pt-client', clientId],
    queryFn: () => api.get(`/pt/clients/${clientId}`).then((r) => r.data),
    enabled: !!clientId,
  });
}