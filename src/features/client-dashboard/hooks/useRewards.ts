import { useQuery } from "@tanstack/react-query";
import { mockRewards } from "@/mock/data";

export function useRewards() {
  return useQuery({
    queryKey: ["client", "rewards"],
    queryFn: async () => mockRewards,
    initialData: mockRewards,
  });
}
