import { useQuery } from "@tanstack/react-query";
import { mockExercises } from "@/mock/data";

// src/features/pt-dashboard/hooks/useExerciseLibrary.ts
import { useState } from 'react';
import { api } from '@/lib/api';

export interface Exercise {
  id: number;
  title: string;
  category: 'head_neck' | 'upper_limb' | 'back' | 'lower_limb';
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
  const [category, setCategory] = useState('');
  const [search, setSearch]     = useState('');
  const [difficulty, setDifficulty] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['exercises', category, search, difficulty],
    queryFn: () =>
      api.get('/pt/exercises', {
        params: { category, search, difficulty },
      }).then((r) => r.data),
  });

  return {
    exercises: data?.data ?? [],
    isLoading,
    category, setCategory,
    search, setSearch,
    difficulty, setDifficulty,
  };
}
