// src/features/shared/hooks/useChatRead.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import getEcho from '@/features/shared/utils/echo';

type ReadScope = 'pt' | 'client';

interface UseChatReadArgs {
  scope: ReadScope;
  clientId: number | null | undefined;
  selfUserId: number | null | undefined;
}

/**
 * Persisted read-receipt support.
 * - `markRead()` hits POST /{scope}/chat/read which updates read_at on the
 *   server and broadcasts MessageRead on the chat channel.
 * - Listens for peer MessageRead events and exposes the peer's
 *   last_read_message_id so the UI can paint double-check ticks.
 */
export function useChatRead({ scope, clientId, selfUserId }: UseChatReadArgs) {
  const [peerLastReadMessageId, setPeerLastReadMessageId] = useState<number | null>(null);
  const channelBoundRef = useRef<string | null>(null);

  useEffect(() => {
    if (!clientId) return;
    const channelName = `chat.${clientId}`;
    channelBoundRef.current = channelName;
    setPeerLastReadMessageId(null);

    try {
      const channel = getEcho().private(channelName);
      channel.listen('.message.read', (e: { reader_id: number; last_read_message_id: number | null }) => {
        if (e.reader_id === selfUserId) return;
        if (e.last_read_message_id) setPeerLastReadMessageId((prev) => Math.max(prev ?? 0, e.last_read_message_id!));
      });
    } catch (err) {
      console.warn('Read-receipt listener failed:', err);
    }

    return () => {
      channelBoundRef.current = null;
    };
  }, [clientId, selfUserId]);

  const markMutation = useMutation({
    mutationFn: (payload: { client_id?: number }) =>
      api.post(`/${scope}/chat/read`, payload).then((r) => r.data),
  });

  const markRead = useCallback(
    (opts?: { clientId?: number }) => {
      const id = opts?.clientId ?? clientId;
      if (!id) return;
      markMutation.mutate({ client_id: id });
    },
    [clientId, markMutation]
  );

  return { peerLastReadMessageId, markRead };
}
