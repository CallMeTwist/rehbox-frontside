// src/features/shared/utils/echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;

let echoInstance: InstanceType<typeof Echo> | null = null;

function getEcho(): InstanceType<typeof Echo> {
  // Only instantiate when first used — not at import time
  if (!echoInstance) {
    const key = import.meta.env.VITE_REVERB_APP_KEY;

    if (!key) {
      console.warn('VITE_REVERB_APP_KEY is not set — WebSocket disabled');
      // Return a dummy object so the app doesn't crash
      return {
        channel: () => ({ listen: () => ({}) }),
        leaveChannel: () => {},
      } as any;
    }

    echoInstance = new Echo({
  broadcaster:       'reverb',
  key,
  wsHost:            import.meta.env.VITE_REVERB_HOST  ?? 'localhost',
  wsPort:            Number(import.meta.env.VITE_REVERB_PORT) ?? 9000,
  wssPort:           Number(import.meta.env.VITE_REVERB_PORT) ?? 9000,
  forceTLS:          (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
  enabledTransports: ['ws', 'wss'],
  enableLogging:     true,
  authEndpoint:      'http://127.0.0.1:8000/api/broadcasting/auth',  // ← add this
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('rehbox-auth')
        ? JSON.parse(localStorage.getItem('rehbox-auth')!).state?.token ?? ''
        : ''}`,
    },
  },
});
  }

  return echoInstance;
}

export default getEcho;