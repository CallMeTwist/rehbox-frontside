// src/features/shared/hooks/usePushNotifications.ts
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export function usePushNotifications() {
  const [isSupported, setIsSupported]   = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
  }, []);

  const subscribe = async () => {
    if (!isSupported) return;
    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      });

      const key  = subscription.getKey('p256dh');
      const auth = subscription.getKey('auth');

      await api.post('/client/push/subscribe', {
        endpoint:   subscription.endpoint,
        public_key: key  ? btoa(String.fromCharCode(...new Uint8Array(key)))  : '',
        auth_token: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : '',
      });

      setIsSubscribed(true);
    } catch (err) {
      console.error('Push subscription failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    await api.delete('/client/push/unsubscribe');
    setIsSubscribed(false);
  };

  return { isSupported, isSubscribed, isLoading, subscribe, unsubscribe };
}