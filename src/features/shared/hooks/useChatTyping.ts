// src/features/shared/hooks/useChatTyping.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import getEcho, { hasEcho } from '@/features/shared/utils/echo';

/**
 * Typing indicator via Laravel Echo whispers — no backend storage.
 *
 * Whisper events live only on the WebSocket layer, so we get instant
 * "peer is typing..." without hitting the API. Auto-expires 4s after last
 * whisper in case the peer drops the connection mid-type.
 */
export function useChatTyping(clientId: number | null | undefined, selfUserId: number | null | undefined) {
  const [peerTyping, setPeerTyping] = useState<{ userId: number; name: string } | null>(null);
  const expiryTimerRef = useRef<number | null>(null);
  const lastSentRef = useRef<number>(0);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!clientId) return;
    const channelName = `chat.${clientId}`;

    try {
      const channel = getEcho().private(channelName);
      channelRef.current = channel;

      // Listen for peer whispers
      channel.listenForWhisper('typing', (e: { user_id: number; name: string }) => {
        if (e.user_id === selfUserId) return;
        setPeerTyping({ userId: e.user_id, name: e.name });

        if (expiryTimerRef.current) window.clearTimeout(expiryTimerRef.current);
        expiryTimerRef.current = window.setTimeout(() => setPeerTyping(null), 4000);
      });

      channel.listenForWhisper('stopped-typing', (e: { user_id: number }) => {
        if (e.user_id === selfUserId) return;
        setPeerTyping(null);
        if (expiryTimerRef.current) window.clearTimeout(expiryTimerRef.current);
      });
    } catch (err) {
      console.warn('Typing whisper setup failed:', err);
    }

    return () => {
      channelRef.current = null;
      if (expiryTimerRef.current) window.clearTimeout(expiryTimerRef.current);
      setPeerTyping(null);
    };
  }, [clientId, selfUserId]);

  /** Throttled: max one whisper every 1.5s while actively typing. */
  const sendTyping = useCallback(
    (name: string) => {
      if (!clientId || !selfUserId) return;
      const now = Date.now();
      if (now - lastSentRef.current < 1500) return;
      lastSentRef.current = now;

      try {
        if (!hasEcho()) return;
        const channel = getEcho().private(`chat.${clientId}`);
        channel.whisper('typing', { user_id: selfUserId, name });
      } catch {
        /* whispers are best-effort */
      }
    },
    [clientId, selfUserId]
  );

  const sendStoppedTyping = useCallback(() => {
    if (!clientId || !selfUserId) return;
    try {
      if (!hasEcho()) return;
      const channel = getEcho().private(`chat.${clientId}`);
      channel.whisper('stopped-typing', { user_id: selfUserId });
    } catch {
      /* best-effort */
    }
  }, [clientId, selfUserId]);

  return { peerTyping, sendTyping, sendStoppedTyping };
}
