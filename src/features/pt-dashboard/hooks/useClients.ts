import { useQuery } from "@tanstack/react-query";
import { mockClients } from "@/mock/data";

export function useClients() {
  return useQuery({
    queryKey: ["pt", "clients"],
    queryFn: async () => mockClients,
    initialData: mockClients,
  });
}
