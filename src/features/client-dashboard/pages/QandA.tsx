// src/features/client-dashboard/pages/QandA.tsx
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useChatSocket } from '@/features/shared/hooks/useWebSocket';

const QandA = () => {
  const user        = useAuthStore((s) => s.user);
  const qc          = useQueryClient();
  const [text, setText] = useState('');
  const bottomRef   = useRef<HTMLDivElement>(null);

  // Get client profile to find their PT
  const { data: clientData } = useQuery({
    queryKey: ['client-profile'],
    queryFn:  () => api.get('/client/profile').then((r) => r.data),
  });

  const ptUserId = clientData?.client?.physiotherapist?.user_id;
  const clientId = clientData?.client?.id;

  // Fetch messages
  const { data: messages = [] } = useQuery({
    queryKey: ['chat', clientId],
    queryFn:  () =>
      api.get('/client/chat', { params: { client_id: clientId } }).then((r) => r.data),
    enabled: !!clientId,
    refetchInterval: false, // Reverb handles real-time
  });

  // Real-time incoming messages
  useChatSocket((msg: any) => {
    qc.setQueryData(['chat', clientId], (old: any[] = []) => [...old, msg]);
  });

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: () =>
      api.post('/client/chat', {
        receiver_id: ptUserId,
        client_id:   clientId,
        body:        text.trim(),
      }),
    onSuccess: ({ data }) => {
      qc.setQueryData(['chat', clientId], (old: any[] = []) => [...old, data]);
      setText('');
    },
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || sendMutation.isPending) return;
    sendMutation.mutate();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
            {clientData?.client?.physiotherapist?.user?.name?.charAt(0) ?? 'PT'}
          </div>
          <div>
            <p className="font-semibold text-sm">
              {clientData?.client?.physiotherapist?.user?.name ?? 'Your Physiotherapist'}
            </p>
            <p className="text-xs text-muted-foreground">
              Typical reply time: 5–10 minutes
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">💬</p>
            <p className="font-medium text-sm">No messages yet</p>
            <p className="text-xs mt-1">Send a message to your physiotherapist</p>
          </div>
        )}

        {messages.map((msg: any) => {
          const isOwn = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                isOwn
                  ? 'gradient-primary text-white rounded-br-sm'
                  : 'bg-muted rounded-bl-sm'
              }`}>
                <p className="text-sm leading-relaxed">{msg.body}</p>
                <p className={`text-xs mt-1 ${isOwn ? 'text-white/60' : 'text-muted-foreground'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
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
      </div>
    </div>
  );
};

export default QandA;