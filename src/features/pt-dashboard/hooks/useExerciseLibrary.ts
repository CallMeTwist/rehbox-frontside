import { useQuery } from "@tanstack/react-query";
import { mockExercises } from "@/mock/data";

export function useExerciseLibrary() {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async () => mockExercises,
    initialData: mockExercises,
  });
}
