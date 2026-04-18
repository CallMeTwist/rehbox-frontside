// src/features/pt-dashboard/pages/Messages.tsx
import { useState, useEffect, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useOnlineUsers } from "@/features/shared/hooks/useOnlineUsers";
import getEcho, { hasEcho } from "@/features/shared/utils/echo";
import { ChatFilePreview, MessageFile } from '@/features/client-dashboard/components/ChatFilePreview';

const Messages = () => {
  const { user } = useAuthStore();
  const token    = useAuthStore((s) => s.token);
  const qc       = useQueryClient();

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [input, setInput]                   = useState("");
  const [file, setFile]                     = useState<File | null>(null);
  const bottomRef                           = useRef<HTMLDivElement>(null);
  const fileInputRef                        = useRef<HTMLInputElement>(null);
  const { isOnline }                        = useOnlineUsers();

  // Track the previous subscribed channel so cleanup always targets the right one
  const subscribedChannelRef = useRef<string | null>(null);

  // Fetch PT's clients — uses a separate query key from MyClients to avoid cache collision
  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ['pt-clients-chat'],
    queryFn: () =>
      api.get('/pt/clients').then((r) => {
        const d = r.data;
        return Array.isArray(d) ? d : (d.clients ?? []);
      }),
  });

  const clients = Array.isArray(clientsData) ? clientsData : [];

  // Auto-select first client on load
  useEffect(() => {
    if (clients.length > 0 && !selectedClient) {
      setSelectedClient(clients[0]);
    }
  }, [clients]);

  // Fetch messages for the selected client
  const { data: messagesData } = useQuery({
    queryKey: ['pt-messages', selectedClient?.id],
    queryFn: () =>
      api
        .get('/pt/chat', { params: { client_id: selectedClient.id } })
        .then((r) => r.data.messages ?? []),
    enabled: !!selectedClient,
    refetchInterval: false,
  });

  const messages = messagesData ?? [];

  // Real-time chat subscription — one private channel per selected client
  useEffect(() => {
    if (!selectedClient || !token) return;

    const channelName = `chat.${selectedClient.id}`;
    subscribedChannelRef.current = channelName;

    try {
      const channel = getEcho().private(channelName);
      channel.listen('.message.sent', (msg: any) => {
        qc.setQueryData(
          ['pt-messages', selectedClient.id],
          (old: any[] = []) => {
            if (old.find((m: any) => m.id === msg.id)) return old;
            return [...old, msg];
          }
        );
      });
    } catch (err) {
      console.warn('PT chat socket error:', err);
    }

    return () => {
      // Guard: only leave if Echo is alive to avoid recreating it with a stale token
      try {
        if (hasEcho()) getEcho().leaveChannel(channelName);
      } catch {}
      subscribedChannelRef.current = null;
    };
  }, [selectedClient?.id, token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send a message
  const sendMutation = useMutation({
    mutationFn: () => {
      if (file) {
        const formData = new FormData();
        formData.append('receiver_id', String(selectedClient.user_id));
        formData.append('client_id', String(selectedClient.id));
        if (input.trim()) formData.append('body', input.trim());
        formData.append('file', file);
        return api.post('/pt/chat', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      return api.post('/pt/chat', {
        receiver_id: selectedClient.user_id,
        client_id:   selectedClient.id,
        body:        input.trim(),
      });
    },
    onSuccess: ({ data }) => {
      qc.setQueryData(
        ['pt-messages', selectedClient.id],
        (old: any[] = []) => [...old, data.message]
      );
      setInput('');
      setFile(null);
    },
  });

  const handleSend = () => {
    if ((!input.trim() && !file) || !selectedClient || sendMutation.isPending) return;
    sendMutation.mutate();
  };

  return (
    <div className="animate-slide-up flex gap-6 h-[calc(100vh-10rem)]">

      {/* Client list */}
      <div className="w-64 bg-card rounded-2xl border border-border overflow-hidden flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold text-sm">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {clientsLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : clients.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-3xl mb-2">👥</p>
              <p className="text-xs text-muted-foreground">No clients yet</p>
            </div>
          ) : (
            clients.map((c: any) => (
              <button
                key={c.id}
                onClick={() => setSelectedClient(c)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${
                  selectedClient?.id === c.id
                    ? 'bg-primary/5 border-l-2 border-primary'
                    : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${
                      isOnline(c.user_id) ? 'bg-success' : 'bg-muted-foreground'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {c.primary_condition ?? 'No condition set'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat pane */}
      {!selectedClient ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-sm">Select a client to start chatting</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border mb-4 flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                {selectedClient.name.charAt(0).toUpperCase()}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                  isOnline(selectedClient.user_id) ? 'bg-success' : 'bg-muted-foreground'
                }`}
              />
            </div>
            <div>
              <p className="font-semibold text-sm">{selectedClient.name}</p>
              <p
                className={`text-xs font-medium ${
                  isOnline(selectedClient.user_id) ? 'text-success' : 'text-muted-foreground'
                }`}
              >
                {isOnline(selectedClient.user_id) ? '● Online' : '○ Offline'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pb-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                No messages yet — start the conversation!
              </div>
            )}
            {messages.map((msg: any) => {
              const isOwn = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2.5 ${
                      isOwn
                        ? 'gradient-primary text-white rounded-br-sm'
                        : 'bg-card border border-border rounded-bl-sm'
                    }`}
                  >
                    {msg.body && <p className="text-sm">{msg.body}</p>}
                    {msg.file_url && (
                      <MessageFile
                        fileUrl={msg.file_url}
                        fileType={msg.file_type ?? ''}
                        fileName={msg.file_name ?? 'file'}
                        fileSize={msg.file_size ?? 0}
                      />
                    )}
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? 'text-white/60' : 'text-muted-foreground'
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* File preview */}
          {file && (
            <div className="px-4 pt-2">
              <ChatFilePreview file={file} onRemove={() => setFile(null)} />
            </div>
          )}

          {/* Input */}
          <div className="flex gap-3 pt-4 border-t border-border flex-shrink-0">
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
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0"
            >
              <Paperclip size={16} className="text-muted-foreground" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            <button
              onClick={handleSend}
              disabled={sendMutation.isPending || (!input.trim() && !file)}
              className="gradient-primary text-white p-2.5 rounded-xl shadow-primary hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
