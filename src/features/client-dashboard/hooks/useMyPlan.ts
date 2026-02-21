import { useQuery } from "@tanstack/react-query";
import { mockPlan } from "@/mock/data";

export function useMyPlan() {
  return useQuery({
    queryKey: ["client", "plan"],
    queryFn: async () => mockPlan,
    initialData: mockPlan,
  });
}
