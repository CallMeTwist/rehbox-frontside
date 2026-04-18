// src/features/client-dashboard/pages/QandA.tsx
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useChatSocket } from '@/features/shared/hooks/useWebSocket';
import { UpgradeLocked } from '@/features/shared/components/UpgradeLocked';
import { ChatFilePreview, MessageFile } from '../components/ChatFilePreview';

const QandA = () => {
  const user  = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef    = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isClient = user?.role === 'client';
  //    because QandA is only accessible from ClientLayout)
  const { data: clientData } = useQuery({
    queryKey: ['client-profile'],
    queryFn:  () => api.get('/client/profile').then(r => r.data),
    enabled:  isClient,
  });

  const ptName = clientData?.client?.physiotherapist?.name
    ?? clientData?.client?.physiotherapist?.user?.name
    ?? 'Your Physiotherapist';
  const ptInitial = ptName.charAt(0).toUpperCase();

  //Fetch messages — single consistent query key
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['client-chat'],
    queryFn:  async () => {
      const res  = await api.get('/client/chat');
      const data = res.data;
      return Array.isArray(data) ? data : (data.messages ?? []);
    },
    enabled: isClient,
  });

  //Real-time: append incoming messages using SAME query key
  useChatSocket((msg: any) => {
    qc.setQueryData(
      ['client-chat'],                                
      (old: any[] = []) => {
        // Avoid duplicates
        if (old.find((m) => m.id === msg.id)) return old;
        return [...old, msg];
      }
    );
  });

  // ── Scroll to bottom ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message — no need to pass client_id or receiver_id ──
  const sendMutation = useMutation({
    mutationFn: (body: string) => {
      if (file) {
        const formData = new FormData();
        if (body) formData.append('body', body);
        formData.append('file', file);
        return api.post('/client/chat', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      return api.post('/client/chat', { body });
    },
    onSuccess: ({ data }) => {
      const newMsg = data.message ?? data;
      qc.setQueryData(
        ['client-chat'],                                  // ✅ same key
        (old: any[] = []) => {
          if (old.find((m) => m.id === newMsg.id)) return old;
          return [...old, newMsg];
        }
      );
      setText('');
      setFile(null);
    },
  });

  const handleSend = () => {
    if ((!text.trim() && !file) || sendMutation.isPending) return;
    sendMutation.mutate(text.trim());
  };

  // ── Subscription gating ──
  const subscriptionPlan = clientData?.client?.subscription_plan ?? 'basic';
  const profileLoading = !clientData;

  if (!profileLoading && subscriptionPlan === 'basic') {
    return <UpgradeLocked feature="Chat with PT" />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">

      {/* Header */}
      <div className="p-4 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-white">
            {ptInitial}
          </div>
          <div>
            <p className="font-semibold text-sm">{ptName}</p>
            <p className="text-xs text-muted-foreground">
              {clientData?.client?.physiotherapist
                ? 'Typical reply time: 5–10 minutes'
                : 'Connect with a PT to start chatting'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
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
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isOwn
                    ? 'gradient-primary text-white rounded-br-sm'
                    : 'bg-muted rounded-bl-sm'
                }`}>
                  {!isOwn && (
                    <p className="text-xs font-semibold mb-0.5 opacity-60">
                      {msg.sender?.name ?? 'PT'}
                    </p>
                  )}
                  {msg.body && <p className="text-sm leading-relaxed">{msg.body}</p>}
                  {msg.file_url && (
                    <MessageFile
                      fileUrl={msg.file_url}
                      fileType={msg.file_type ?? ''}
                      fileName={msg.file_name ?? 'file'}
                      fileSize={msg.file_size ?? 0}
                    />
                  )}
                  <p className={`text-xs mt-1 ${isOwn ? 'text-white/60' : 'text-muted-foreground'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit', minute: '2-digit',
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
        {!clientData?.client?.physiotherapist ? (
          <p className="text-center text-sm text-muted-foreground py-2">
            Link a physiotherapist to start messaging
          </p>
        ) : (
          <>
            {file && (
              <div className="px-4 pt-2">
                <ChatFilePreview file={file} onRemove={() => setFile(null)} />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && f.size > 10 * 1024 * 1024) {
                  toast.error('File must be under 10 MB');
                  return;
                }
                if (f) setFile(f);
                e.target.value = '';
              }}
            />
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0"
              >
                <Paperclip size={16} className="text-muted-foreground" />
              </button>
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
                disabled={(!text.trim() && !file) || sendMutation.isPending}
                className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default QandA;