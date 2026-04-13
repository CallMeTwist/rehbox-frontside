// // src/features/shared/hooks/useOnlineUsers.ts
// import { useState, useEffect } from 'react';
// import getEcho from '@/features/shared/utils/echo';
// import { useAuthStore } from '@/store/authStore';

// // Returns a Set of user IDs who are currently online
// export function useOnlineUsers() {
//   const user    = useAuthStore((s) => s.user);
//   const [onlineIds, setOnlineIds] = useState<Set<number>>(new Set());

//   useEffect(() => {
//     if (!user) return;

//     const echo    = getEcho();
//     // Presence channel — all logged-in users join this
//     const channel = echo.join('online');

//     channel
//       .here((users: { id: number }[]) => {
//         setOnlineIds(new Set(users.map((u) => u.id)));
//       })
//       .joining((user: { id: number }) => {
//         setOnlineIds((prev) => new Set([...prev, user.id]));
//       })
//       .leaving((user: { id: number }) => {
//         setOnlineIds((prev) => {
//           const next = new Set(prev);
//           next.delete(user.id);
//           return next;
//         });
//       });

//     return () => {
//       echo.leave('online');
//     };
//   }, [user]);

//   const isOnline = (userId: number) => onlineIds.has(userId);

//   return { onlineIds, isOnline };
// }


// src/features/shared/hooks/useOnlineUsers.ts
import { useState, useEffect } from 'react';
import getEcho, { hasEcho } from '@/features/shared/utils/echo';
import { useAuthStore } from '@/store/authStore';

export function useOnlineUsers() {
  const user               = useAuthStore((s) => s.user);
  const token              = useAuthStore((s) => s.token);  // ← watch token too
  const [onlineIds, setOnlineIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Don't try to join if not logged in
    if (!user || !token) {
      setOnlineIds(new Set());
      return;
    }

    let channel: any;

    try {
      const echo = getEcho();
      channel    = echo.join('online');

      channel
        .here((users: { id: number }[]) => {
          setOnlineIds(new Set(users.map((u) => u.id)));
        })
        .joining((u: { id: number }) => {
          setOnlineIds((prev) => new Set([...prev, u.id]));
        })
        .leaving((u: { id: number }) => {
          setOnlineIds((prev) => {
            const next = new Set(prev);
            next.delete(u.id);
            return next;
          });
        })
        .error((err: any) => {
          console.warn('Presence channel error:', err);
        });
    } catch (err) {
      console.warn('Echo join failed:', err);
    }

    return () => {
      // Guard: only leave if Echo is alive. Calling getEcho() when echoInstance
      // is null (mid-reset) would create a broken instance with no auth token.
      try {
        if (hasEcho()) getEcho().leave('online');
      } catch {}
    };
  }, [user?.id, token]);  // ← re-run when token changes (after login/reset)

  const isOnline = (userId: number) => onlineIds.has(userId);

  return { onlineIds, isOnline };
}