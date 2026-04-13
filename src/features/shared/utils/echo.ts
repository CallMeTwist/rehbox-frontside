// src/features/shared/utils/echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;

let echoInstance: InstanceType<typeof Echo> | null = null;

/** Returns true only if an Echo instance is currently alive. Use this before
 *  calling leave() in cleanup functions to avoid accidentally creating a new
 *  instance with a stale/empty token just to leave a channel. */
export function hasEcho(): boolean {
  return echoInstance !== null;
}

// ← Export so authStore can reset it on login
export function resetEcho() {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}

function getEcho(): InstanceType<typeof Echo> {
  if (!echoInstance) {
    const key = import.meta.env.VITE_REVERB_APP_KEY;

    if (!key) {
      console.warn('VITE_REVERB_APP_KEY is not set — WebSocket disabled');
      return {
        join:         () => ({ here: () => ({}), joining: () => ({}), leaving: () => ({}) }),
        channel:      () => ({ listen: () => ({}) }),
        leaveChannel: () => {},
        leave:        () => {},
      } as any;
    }

    // ✅ Read from sessionStorage — matches the store switch
    const stored = sessionStorage.getItem('rehbox-auth');
    const token  = stored ? (JSON.parse(stored)?.state?.token ?? '') : '';

    echoInstance = new Echo({
      broadcaster:       'reverb',
      key,
      wsHost:            import.meta.env.VITE_REVERB_HOST ?? 'localhost',
      wsPort:            Number(import.meta.env.VITE_REVERB_PORT) || 9000,
      wssPort:           Number(import.meta.env.VITE_REVERB_PORT) || 9000,
      forceTLS:          (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
      enabledTransports: ['ws', 'wss'],
      enableLogging:     true,
      authEndpoint:      `${import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          Accept:        'application/json',
        },
      },
    });
  }

  return echoInstance;
}

export default getEcho;