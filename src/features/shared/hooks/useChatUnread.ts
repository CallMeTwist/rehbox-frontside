// src/features/shared/hooks/useChatUnread.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

type Scope = 'pt' | 'client';

interface UnreadResponse {
  counts: Record<string, number>;
  total: number;
}

/**
 * Persisted unread counts. For PT returns per-client map; for client returns
 * only a total. Invalidate this query when new messages arrive via Echo so
 * the UI reflects fresh state without polling.
 */
export function useChatUnread(scope: Scope) {
  const user = useAuthStore((s) => s.user);
  const enabled = scope === 'pt' ? user?.role === 'pt' : user?.role === 'client';

  return useQuery<UnreadResponse>({
    queryKey: [`${scope}-chat-unread`],
    queryFn: () =>
      api.get(`/${scope}/chat/unread`).then((r) => {
        const d = r.data;
        const counts: Record<string, number> = {};
        if (d.counts && typeof d.counts === 'object') {
          for (const [k, v] of Object.entries(d.counts)) counts[String(k)] = Number(v);
        }
        return { counts, total: Number(d.total ?? 0) };
      }),
    enabled,
    staleTime: 30_000,
  });
}
