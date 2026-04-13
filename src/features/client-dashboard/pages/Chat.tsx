// src/features/client-dashboard/pages/Chat.tsx
import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Send } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useOnlineUsers } from '@/features/shared/hooks/useOnlineUsers';
import getEcho, { hasEcho } from '@/features/shared/utils/echo';

const Chat = () => {
  const user   = useAuthStore((s) => s.user);
  const token  = useAuthStore((s) => s.token);
  const qc     = useQueryClient();
  const [text, setText] = useState('');
  const bottomRef       = useRef<HTMLDivElement>(null);
  const { isOnline }    = useOnlineUsers();

  const isClient = user?.role === 'client';

  // Fetch profile to get client.id and physiotherapist info
  const { data: profileData } = useQuery({
    queryKey: ['client-profile'],
    queryFn:  () => api.get('/client/profile').then(r => r.data),
    enabled:  isClient,
  });

  const clientId = profileData?.client?.id ?? user?.client_id;
  const pt       = profileData?.client?.physiotherapist;
  const ptName   = pt?.name ?? 'Your Physiotherapist';
  const ptUserId = pt?.user_id;

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['client-chat'],
    queryFn: async () => {
      const res  = await api.get('/client/chat');
      const data = res.data;
      return Array.isArray(data) ? data : (data.messages ?? []);
    },
    enabled: isClient,
  });

  // Subscribe to real-time chat channel — requires clientId to be known
  useEffect(() => {
    if (!clientId || !token) return;

    const channelName = `chat.${clientId}`;

    try {
      const channel = getEcho().private(channelName);
      channel.listen('.message.sent', (msg: any) => {
        qc.setQueryData(
          ['client-chat'],
          (old: any[] = []) => {
            if (old.find((m) => m.id === msg.id)) return old;
            return [...old, msg];
          }
        );
      });
    } catch (err) {
      console.warn('Client chat socket error:', err);
    }

    return () => {
      try {
        if (hasEcho()) getEcho().leaveChannel(channelName);
      } catch {}
    };
  }, [clientId, token]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMutation = useMutation({
    mutationFn: (body: string) => api.post('/client/chat', { body }),
    onSuccess: ({ data }) => {
      const newMsg = data.message ?? data;
      qc.setQueryData(
        ['client-chat'],
        (old: any[] = []) => {
          if (old.find((m) => m.id === newMsg.id)) return old;
          return [...old, newMsg];
        }
      );
      setText('');
    },
  });

  const handleSend = () => {
    if (!text.trim() || sendMutation.isPending) return;
    sendMutation.mutate(text.trim());
  };

  const ptOnline = ptUserId ? isOnline(ptUserId) : false;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">

      {/* Header */}
      <div className="p-4 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-white">
              {ptName.charAt(0).toUpperCase()}
            </div>
            {pt && (
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                  ptOnline ? 'bg-success' : 'bg-muted-foreground'
                }`}
              />
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">{ptName}</p>
            {pt ? (
              <p className={`text-xs font-medium ${ptOnline ? 'text-success' : 'text-muted-foreground'}`}>
                {ptOnline ? '● Online' : '○ Offline'}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Connect with a PT to start chatting</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className="h-10 w-48 bg-muted rounded-2xl animate-pulse" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">💬</p>
            <p className="font-medium text-sm">No messages yet</p>
            <p className="text-xs mt-1">Send a message to your physiotherapist</p>
          </div>
        ) : (
          messages.map((msg: any) => {
            const isOwn = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isOwn
                      ? 'gradient-primary text-white rounded-br-sm'
                      : 'bg-muted rounded-bl-sm'
                  }`}
                >
                  {!isOwn && (
                    <p className="text-xs font-semibold mb-0.5 opacity-60">
                      {msg.sender?.name ?? ptName}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.body}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-white/60' : 'text-muted-foreground'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card flex-shrink-0">
        {!pt ? (
          <p className="text-center text-sm text-muted-foreground py-2">
            Link a physiotherapist to start messaging
          </p>
        ) : (
          <div className="flex gap-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || sendMutation.isPending}
              className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition"
            >
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
