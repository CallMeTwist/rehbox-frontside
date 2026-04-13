// src/features/pt-dashboard/hooks/useExerciseLibrary.ts
import { useQuery } from "@tanstack/react-query";
import { useState } from 'react';
import api from '@/lib/api';

export interface Exercise {
  id: number;
  title: string;
  area: 'neck' | 'shoulder' | 'elbow_forearm_wrist' | 'back' | 'lower_limb';
  category: 'strengthening' | 'stretching' | 'rom' | 'functional' | 'endurance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
  video_url?: string;
  illustration_url?: string;
  default_sets: number;
  default_reps: number;
  default_hold_seconds: number;
  instructions_en?: string;
}

export function useExerciseLibrary() {
  const [area, setArea]           = useState('');
  const [category, setCategory]   = useState('');
  const [search, setSearch]       = useState('');
  const [difficulty, setDifficulty] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['exercises', area, category, search, difficulty],
    queryFn: () =>
      api.get('/pt/exercises', {
        params: { area, category, search, difficulty },
      }).then((r) => r.data),
  });

  return {
    exercises: (data?.data ?? []) as Exercise[],
    isLoading,
    area,       setArea,
    category,   setCategory,
    search,     setSearch,
    difficulty, setDifficulty,
  };
}
