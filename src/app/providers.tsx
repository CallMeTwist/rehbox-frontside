import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { LanguageProvider } from '@/features/shared/context/LanguageContext';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider> 
      <Toaster />
      <Sonner />
      {children}
      </LanguageProvider> 
    </TooltipProvider>
  </QueryClientProvider>
);

export default Providers;
