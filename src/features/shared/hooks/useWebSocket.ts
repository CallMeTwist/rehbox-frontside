import { useEffect, useRef, useCallback, useState } from "react";

type MessageHandler = (data: unknown) => void;

/**
 * WebSocket hook for real-time features (notifications, chat)
 * Currently a placeholder - connects when a real WS endpoint is configured
 */
export function useWebSocket(url?: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(() => {
    if (!url) return;
    try {
      const ws = new WebSocket(url);
      ws.onopen = () => setConnected(true);
      ws.onclose = () => setConnected(false);
      ws.onerror = () => setConnected(false);
      wsRef.current = ws;
    } catch {
      setConnected(false);
    }
  }, [url]);

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const onMessage = useCallback((handler: MessageHandler) => {
    if (wsRef.current) {
      wsRef.current.onmessage = (event) => {
        try {
          handler(JSON.parse(event.data));
        } catch {
          handler(event.data);
        }
      };
    }
  }, []);

  useEffect(() => {
    connect();
    return () => { wsRef.current?.close(); };
  }, [connect]);

  return { connected, send, onMessage };
}
