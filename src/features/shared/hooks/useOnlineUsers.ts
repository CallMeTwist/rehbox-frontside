// src/features/shared/hooks/useOnlineUsers.ts
import { useState, useEffect } from 'react';
import getEcho from '@/features/shared/utils/echo';
import { useAuthStore } from '@/store/authStore';

// Returns a Set of user IDs who are currently online
export function useOnlineUsers() {
  const user    = useAuthStore((s) => s.user);
  const [onlineIds, setOnlineIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!user) return;

    const echo    = getEcho();
    // Presence channel — all logged-in users join this
    const channel = echo.join('online');

    channel
      .here((users: { id: number }[]) => {
        setOnlineIds(new Set(users.map((u) => u.id)));
      })
      .joining((user: { id: number }) => {
        setOnlineIds((prev) => new Set([...prev, user.id]));
      })
      .leaving((user: { id: number }) => {
        setOnlineIds((prev) => {
          const next = new Set(prev);
          next.delete(user.id);
          return next;
        });
      });

    return () => {
      echo.leave('online');
    };
  }, [user]);

  const isOnline = (userId: number) => onlineIds.has(userId);

  return { onlineIds, isOnline };
}