// src/features/shared/hooks/useWebSocket.ts
import { useEffect } from 'react';
import getEcho from '@/features/shared/utils/echo';   // ← named getEcho now
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

  useEffect(() => {
    if (!user) return;

    const echo    = getEcho();                        // ← call as function
    const channel = echo.channel(`chat.${user.id}`);

    channel.listen('.message.new', onMessage);

    return () => {
      echo.leaveChannel(`chat.${user.id}`);
    };
  }, [user, onMessage]);
}