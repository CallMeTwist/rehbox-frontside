// import { useState } from "react";

// export function useMotionData() {
//   const [isTracking, setIsTracking] = useState(false);
//   const [accuracy, setAccuracy] = useState(0);
//   const [repCount, setRepCount] = useState(0);

//   return { isTracking, setIsTracking, accuracy, setAccuracy, repCount, setRepCount };
// }

// src/features/pt-dashboard/hooks/useMotionData.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useClientMotionReports(clientId: number) {
  return useQuery({
    queryKey: ['motion-reports', clientId],
    queryFn:  () => api.get(`/pt/clients/${clientId}/motion-reports`).then(r => r.data),
    enabled:  !!clientId,
  });
}

export function useEarnings() {
  return useQuery({
    queryKey: ['pt-earnings'],
    queryFn:  () => api.get('/pt/earnings').then(r => r.data),
  });
}