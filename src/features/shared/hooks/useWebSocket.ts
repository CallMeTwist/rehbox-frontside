// src/features/shared/hooks/useWebSocket.ts
import { useEffect } from 'react';
import getEcho, { hasEcho } from '@/features/shared/utils/echo';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export function usePTNotifications() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user || user.role !== 'pt') return;

    const echo    = getEcho();                        // ← call as function
    const channel = echo.channel(`pt.${user.id}`);

    channel.listen('.client.started', (data: any) => {
      toast(`🏃 ${data.client_name} started an exercise`, {
        icon: '▶️', duration: 4000,
      });
    });

    channel.listen('.client.completed', (data: any) => {
      toast.success(
        `✅ ${data.client_name} completed a session! Form score: ${data.form_score ?? 'N/A'}%`
      );
    });

    return () => {
      echo.leaveChannel(`pt.${user.id}`);
    };
  }, [user]);
}

export function useChatSocket(onMessage: (msg: any) => void) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!user || !token) return;

    // client_id is now stored in authStore.user (returned by login/register)
    const clientId = user.role === 'client' ? user.client_id : null;
    const channelName = clientId ? `chat.${clientId}` : null;
    if (!channelName) return;

    let channel: any;
    try {
      channel = getEcho().private(channelName);
      channel.listen('.message.sent', (e: any) => {
        onMessage(e);
      });
    } catch (err) {
      console.warn('Chat socket error:', err);
    }

    return () => {
      try {
        if (hasEcho()) getEcho().leaveChannel(channelName);
      } catch {}
    };
  }, [user?.id, token]);  // ← re-run on token change
}
