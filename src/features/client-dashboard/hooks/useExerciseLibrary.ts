import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { Exercise, ExerciseArea, ExerciseCategory } from '@/types/exercise';

export interface LibraryFilters {
  area?: ExerciseArea;
  category?: ExerciseCategory;
  access_tier?: 'free' | 'paid';
}

export function useExerciseLibrary(filters: LibraryFilters = {}) {
  const { user } = useAuthStore();
  const isClient = user?.role === 'client';

  return useQuery({
    queryKey: ['client-exercise-library', filters],
    queryFn: async () => {
      const res = await api.get<{ data: Exercise[] }>('/client/exercises', { params: filters });
      return res.data.data;
    },
    enabled: isClient,
  });
}
