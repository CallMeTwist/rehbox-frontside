// src/features/pt-dashboard/pages/Messages.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { Send, Paperclip, Search, ArrowLeft, MessageSquare } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useOnlineUsers } from '@/features/shared/hooks/useOnlineUsers';
import getEcho, { hasEcho } from '@/features/shared/utils/echo';
import { ChatFilePreview } from '@/features/client-dashboard/components/ChatFilePreview';
import { useChatTyping } from '@/features/shared/hooks/useChatTyping';
import { useChatRead } from '@/features/shared/hooks/useChatRead';
import { useChatUnread } from '@/features/shared/hooks/useChatUnread';
import {
  ChatBubble,
  DaySeparator,
  TypingIndicator,
  annotateMessages,
  dayLabel,
  type ChatMessage,
} from '@/features/shared/components/chat/ChatPrimitives';

const Messages = () => {
  const { user } = useAuthStore();
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isOnline } = useOnlineUsers();

  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ['pt-clients-chat'],
    queryFn: () =>
      api.get('/pt/clients').then((r) => {
        const d = r.data;
        return Array.isArray(d) ? d : (d.clients ?? []);
      }),
  });

  const clients = Array.isArray(clientsData) ? clientsData : [];

  const { data: unread } = useChatUnread('pt');

  useEffect(() => {
    if (clients.length > 0 && !selectedClient) {
      // On desktop pre-select first; on mobile keep list visible
      if (window.matchMedia('(min-width: 1024px)').matches) {
        setSelectedClient(clients[0]);
      }
    }
  }, [clients, selectedClient]);

  const { data: messagesData } = useQuery<ChatMessage[]>({
    queryKey: ['pt-messages', selectedClient?.id],
    queryFn: () =>
      api.get('/pt/chat', { params: { client_id: selectedClient.id } }).then((r) => r.data.messages ?? []),
    enabled: !!selectedClient,
    refetchInterval: false,
  });

  const messages = messagesData ?? [];

  const { peerTyping, sendTyping, sendStoppedTyping } = useChatTyping(selectedClient?.id, user?.id);
  const { peerLastReadMessageId, markRead } = useChatRead({
    scope: 'pt',
    clientId: selectedClient?.id,
    selfUserId: user?.id,
  });

  // Global subscription to ALL client chat channels so unread counts bump
  // even for non-selected conversations.
  useEffect(() => {
    if (!token || clients.length === 0) return;
    const bound: string[] = [];
    clients.forEach((c: any) => {
      const channelName = `chat.${c.id}`;
      bound.push(channelName);
      try {
        const channel = getEcho().private(channelName);
        channel.listen('.message.sent', (msg: ChatMessage) => {
          if (msg.sender_id === user?.id) return;

          // If the message is for the currently selected client, inject into its cache
          if (selectedClient?.id === msg.client_id) {
            qc.setQueryData<ChatMessage[]>(['pt-messages', msg.client_id], (old = []) => {
              if (old.find((m) => m.id === msg.id)) return old;
              return [...old, msg];
            });
            if (document.visibilityState === 'visible') {
              markRead({ clientId: msg.client_id });
            }
          }
          // Always refresh unread counts
          qc.invalidateQueries({ queryKey: ['pt-chat-unread'] });
        });
      } catch (err) {
        console.warn('PT chat listen error:', err);
      }
    });

    return () => {
      try {
        if (!hasEcho()) return;
        bound.forEach((ch) => getEcho().leaveChannel(ch));
      } catch {
        /* noop */
      }
    };
  }, [clients, token, selectedClient?.id, user?.id, qc, markRead]);

  // Mark read on client open / messages arriving while open
  useEffect(() => {
    if (!selectedClient || messages.length === 0) return;
    if (document.visibilityState !== 'visible') return;
    const hasUnread = messages.some((m) => m.receiver_id === user?.id && !m.read_at);
    if (hasUnread) {
      markRead({ clientId: selectedClient.id });
      qc.invalidateQueries({ queryKey: ['pt-chat-unread'] });
    }
  }, [selectedClient, messages, user?.id, markRead, qc]);

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }, [input]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, peerTyping]);

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
        client_id: selectedClient.id,
        body: input.trim(),
      });
    },
    onSuccess: ({ data }) => {
      qc.setQueryData<ChatMessage[]>(['pt-messages', selectedClient.id], (old = []) => [
        ...old,
        data.message,
      ]);
      setInput('');
      setFile(null);
      sendStoppedTyping();
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.message ?? 'Failed to send message';
      toast.error(msg);
    },
  });

  const handleSend = () => {
    if ((!input.trim() && !file) || !selectedClient || sendMutation.isPending) return;
    sendMutation.mutate();
  };

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c: any) =>
        c.name?.toLowerCase().includes(q) ||
        c.primary_condition?.toLowerCase().includes(q)
    );
  }, [clients, search]);

  const segmented = useMemo(() => {
    const annotated = annotateMessages(messages);
    const out: Array<
      { type: 'day'; key: string; label: string } | { type: 'msg'; key: string; data: (typeof annotated)[number] }
    > = [];
    let lastDay = '';
    for (const a of annotated) {
      const d = new Date(a.msg.created_at).toDateString();
      if (d !== lastDay) {
        out.push({ type: 'day', key: `day-${d}`, label: dayLabel(a.msg.created_at) });
        lastDay = d;
      }
      out.push({ type: 'msg', key: `m-${a.msg.id}`, data: a });
    }
    return out;
  }, [messages]);

  const unreadCounts = unread?.counts ?? {};
  const showChatPane = !!selectedClient;

  return (
    <div className="animate-slide-up flex gap-4 lg:gap-6 h-[calc(100dvh-10rem)] relative">
      {/* Ambient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.4] overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 10% 0%, hsl(var(--primary) / 0.10), transparent 60%), radial-gradient(ellipse 60% 50% at 100% 100%, hsl(var(--hot-pink) / 0.08), transparent 60%)',
        }}
      />

      {/* Client list */}
      <div
        className={`${
          showChatPane ? 'hidden lg:flex' : 'flex'
        } w-full lg:w-72 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/60 overflow-hidden flex-shrink-0 flex-col shadow-sm relative z-[1]`}
      >
        <div className="p-3 border-b border-border/60 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-sm">Messages</h2>
            {unread?.total ? (
              <span className="gradient-pink text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unread.total}
              </span>
            ) : null}
          </div>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients…"
              className="w-full bg-muted/60 border border-transparent focus:border-primary/40 focus:bg-card rounded-xl text-sm pl-9 pr-3 py-2 focus:outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {clientsLoading ? (
            <div className="p-3 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-muted/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare size={22} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                {search ? 'No clients match that search' : 'No clients yet'}
              </p>
            </div>
          ) : (
            filteredClients.map((c: any) => {
              const online = isOnline(c.user_id);
              const isActive = selectedClient?.id === c.id;
              const count = unreadCounts[String(c.id)] ?? 0;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedClient(c)}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-all border-l-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-[hsl(var(--hot-pink)/0.08)] to-transparent border-[hsl(var(--hot-pink))]'
                      : 'border-transparent hover:bg-muted/50'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-semibold ring-2 ${
                        online ? 'ring-success/30' : 'ring-transparent'
                      }`}
                    >
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${
                        online ? 'bg-success' : 'bg-muted-foreground'
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold truncate">{c.name}</p>
                      {count > 0 && (
                        <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center gradient-pink text-white text-[10px] font-bold rounded-full">
                          {count > 99 ? '99+' : count}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {c.primary_condition ?? 'No condition set'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat pane */}
      {!selectedClient ? (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-card/50 backdrop-blur-xl rounded-2xl border border-border/60 relative z-[1]">
          <div className="text-center text-muted-foreground">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl gradient-primary flex items-center justify-center shadow-[0_8px_30px_-10px_rgba(27,62,143,0.5)]">
              <MessageSquare size={22} className="text-white" />
            </div>
            <p className="font-display font-semibold text-sm text-foreground mb-1">Select a client</p>
            <p className="text-xs">Choose a conversation from the list to start chatting.</p>
          </div>
        </div>
      ) : (
        <div
          className={`${
            showChatPane ? 'flex' : 'hidden lg:flex'
          } flex-1 flex-col min-h-0 bg-card/70 backdrop-blur-xl rounded-2xl border border-border/60 overflow-hidden relative z-[1]`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-3 md:px-4 py-3 border-b border-border/60 flex-shrink-0">
            <button
              onClick={() => setSelectedClient(null)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors -ml-1"
              aria-label="Back to conversations"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold shadow-[0_4px_14px_-4px_rgba(27,62,143,0.5)] ring-2 ring-white/50">
                {selectedClient.name.charAt(0).toUpperCase()}
              </div>
              <>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                    isOnline(selectedClient.user_id) ? 'bg-success' : 'bg-muted-foreground'
                  }`}
                />
                {isOnline(selectedClient.user_id) && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success/60 animate-ping" />
                )}
              </>
            </div>
            <div className="min-w-0">
              <p className="font-display font-semibold text-sm truncate">{selectedClient.name}</p>
              <p
                className={`text-[11px] font-medium ${
                  isOnline(selectedClient.user_id) ? 'text-success' : 'text-muted-foreground'
                }`}
              >
                {isOnline(selectedClient.user_id) ? 'Online now' : 'Offline'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-3 md:px-4 py-4 space-y-1.5 scrollbar-thin">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-3 shadow-[0_8px_30px_-10px_rgba(27,62,143,0.5)]">
                  <MessageSquare size={22} className="text-white" />
                </div>
                <p className="font-display font-semibold text-sm mb-1">No messages yet</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Break the ice — check in on how {selectedClient.name.split(' ')[0]}'s recovery is going.
                </p>
              </div>
            )}
            {segmented.map((item) =>
              item.type === 'day' ? (
                <DaySeparator key={item.key} label={item.label} />
              ) : (
                <ChatBubble
                  key={item.key}
                  msg={item.data.msg}
                  isOwn={item.data.msg.sender_id === user?.id}
                  showTail={item.data.showTail}
                  showTime={item.data.showTime}
                  showSenderName={item.data.showSenderName}
                  isRead={
                    item.data.msg.sender_id === user?.id &&
                    peerLastReadMessageId !== null &&
                    item.data.msg.id <= peerLastReadMessageId
                  }
                />
              )
            )}
            {peerTyping && <TypingIndicator name={peerTyping.name} />}
            <div ref={bottomRef} />
          </div>

          {/* File preview */}
          {file && (
            <div className="px-3 md:px-4 pt-2">
              <ChatFilePreview file={file} onRemove={() => setFile(null)} />
            </div>
          )}

          {/* Composer */}
          <div
            className="px-3 md:px-4 py-3 border-t border-border/60 flex-shrink-0"
            style={{ paddingBottom: `calc(0.75rem + env(safe-area-inset-bottom))` }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
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
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Attach file"
                className="w-11 h-11 rounded-2xl bg-card border border-border flex items-center justify-center hover:bg-muted hover:border-primary/40 transition-all flex-shrink-0"
              >
                <Paperclip size={17} className="text-muted-foreground" />
              </button>
              <div className="flex-1 bg-card border border-border rounded-2xl focus-within:border-primary/50 focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.08)] transition-all">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (user?.name && e.target.value.trim().length > 0) sendTyping(user.name);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  onBlur={() => sendStoppedTyping()}
                  placeholder="Type a message…"
                  className="w-full bg-transparent px-4 py-3 text-sm resize-none focus:outline-none placeholder:text-muted-foreground/70 leading-snug max-h-[140px]"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={sendMutation.isPending || (!input.trim() && !file)}
                aria-label="Send message"
                className="w-11 h-11 gradient-pink rounded-2xl flex items-center justify-center text-white shadow-[0_6px_20px_-6px_rgba(229,25,125,0.6)] hover:shadow-[0_6px_22px_-4px_rgba(229,25,125,0.7)] active:scale-95 disabled:opacity-40 disabled:shadow-none transition-all flex-shrink-0"
              >
                <Send size={17} className="translate-x-[1px]" />
              </button>
            </div>
            {input.length > 4500 && (
              <p className="text-[10px] text-muted-foreground mt-1 text-right">{input.length} / 5000</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
