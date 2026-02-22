// src/features/shared/hooks/useWebSocket.ts
import { useEffect, useCallback } from 'react';
import echo from '@/shared/utils/echo';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
export function usePTNotifications() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user || user.role !== 'pt') return;

    const ptId = user.id;

    // Listen on PT's private channel
    const channel = echo.channel(`pt.${ptId}`);

    channel.listen('.client.started', (data: any) => {
      toast(`🏃 ${data.client_name} started an exercise`, {
        icon: '▶️',
        duration: 4000,
      });
    });

    channel.listen('.client.completed', (data: any) => {
      toast.success(
        `✅ ${data.client_name} completed a session! Form score: ${data.form_score ?? 'N/A'}%`
      );
    });

    return () => {
      echo.leaveChannel(`pt.${ptId}`);
    };
  }, [user]);
}

export function useChatSocket(onMessage: (msg: any) => void) {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    const channel = echo.channel(`chat.${user.id}`);
    channel.listen('.message.new', onMessage);

    return () => {
      echo.leaveChannel(`chat.${user.id}`);
    };
  }, [user, onMessage]);
}