// src/features/client-dashboard/pages/Chat.tsx
import { useEffect, useRef, useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Paperclip, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { ChatFilePreview } from '../components/ChatFilePreview';
import { useAuthStore, useIsFree } from '@/store/authStore';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOnlineUsers } from '@/features/shared/hooks/useOnlineUsers';
import getEcho, { hasEcho } from '@/features/shared/utils/echo';
import { useChatTyping } from '@/features/shared/hooks/useChatTyping';
import { useChatRead } from '@/features/shared/hooks/useChatRead';
import {
  ChatBubble,
  DaySeparator,
  TypingIndicator,
  annotateMessages,
  dayLabel,
  type ChatMessage,
} from '@/features/shared/components/chat/ChatPrimitives';

const Chat = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isOnline } = useOnlineUsers();

  const isClient = user?.role === 'client';
  const isFree = useIsFree();

  const { data: profileData } = useQuery({
    queryKey: ['client-profile'],
    queryFn: () => api.get('/client/profile').then((r) => r.data),
    enabled: isClient,
  });

  const clientId = profileData?.client?.id ?? user?.client_id;
  const pt = profileData?.client?.physiotherapist;
  const ptName = pt?.name ?? 'Your Physiotherapist';
  const ptUserId = pt?.user_id;

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ['client-chat'],
    queryFn: async () => {
      const res = await api.get('/client/chat');
      const data = res.data;
      return Array.isArray(data) ? data : (data.messages ?? []);
    },
    enabled: isClient,
  });

  const { peerTyping, sendTyping, sendStoppedTyping } = useChatTyping(clientId, user?.id);
  const { peerLastReadMessageId, markRead } = useChatRead({
    scope: 'client',
    clientId,
    selfUserId: user?.id,
  });

  // Real-time message stream
  useEffect(() => {
    if (!clientId || !token) return;
    const channelName = `chat.${clientId}`;

    try {
      const channel = getEcho().private(channelName);
      channel.listen('.message.sent', (msg: ChatMessage) => {
        qc.setQueryData<ChatMessage[]>(['client-chat'], (old = []) => {
          if (old.find((m) => m.id === msg.id)) return old;
          return [...old, msg];
        });
        // Auto-mark-read if chat is open and tab focused
        if (document.visibilityState === 'visible' && msg.sender_id !== user?.id) {
          markRead();
          qc.invalidateQueries({ queryKey: ['client-chat-unread'] });
        }
      });
    } catch (err) {
      console.warn('Client chat socket error:', err);
    }

    return () => {
      try {
        if (hasEcho()) getEcho().leaveChannel(channelName);
      } catch {
        /* noop */
      }
    };
  }, [clientId, token, user?.id, qc, markRead]);

  // Mark read on open + whenever message list grows while focused
  useEffect(() => {
    if (!clientId || messages.length === 0) return;
    if (document.visibilityState !== 'visible') return;
    const hasUnreadForMe = messages.some((m) => m.receiver_id === user?.id && !m.read_at);
    if (hasUnreadForMe) {
      markRead();
      qc.invalidateQueries({ queryKey: ['client-chat-unread'] });
    }
  }, [clientId, messages, user?.id, markRead, qc]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }, [text]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, peerTyping]);

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
      const newMsg: ChatMessage = data.message ?? data;
      qc.setQueryData<ChatMessage[]>(['client-chat'], (old = []) => {
        if (old.find((m) => m.id === newMsg.id)) return old;
        return [...old, newMsg];
      });
      setText('');
      setFile(null);
      sendStoppedTyping();
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.message ?? 'Failed to send message';
      toast.error(msg);
    },
  });

  const handleSend = () => {
    if ((!text.trim() && !file) || sendMutation.isPending) return;
    sendMutation.mutate(text.trim());
  };

  const ptOnline = ptUserId ? isOnline(ptUserId) : false;

  // Annotate and segment by day
  const segmented = useMemo(() => {
    const annotated = annotateMessages(messages);
    const out: Array<{ type: 'day'; key: string; label: string } | { type: 'msg'; key: string; data: (typeof annotated)[number] }> = [];
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

  if (isFree) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card rounded-2xl border border-border p-10 text-center max-w-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">Chat Locked</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Upgrade to Standard to chat with a certified physiotherapist about your plan,
            pain points, and progress.
          </p>
          <Link
            to="/subscription"
            className="block w-full gradient-primary text-white rounded-xl py-3 font-semibold text-center shadow-primary"
          >
            Upgrade to Standard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-[calc(100dvh-4rem)] overflow-hidden">
      {/* Ambient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 15% 0%, hsl(var(--primary) / 0.10), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, hsl(var(--hot-pink) / 0.08), transparent 60%)',
        }}
      />

      {/* Header */}
      <div className="relative p-3 md:p-4 border-b border-border/60 bg-card/70 backdrop-blur-xl flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center font-semibold text-white shadow-[0_4px_14px_-4px_rgba(27,62,143,0.5)] ring-2 ring-white/50">
              {ptName.charAt(0).toUpperCase()}
            </div>
            {pt && (
              <>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                    ptOnline ? 'bg-success' : 'bg-muted-foreground'
                  }`}
                />
                {ptOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success/60 animate-ping" />
                )}
              </>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-sm truncate">{ptName}</p>
            {pt ? (
              <p className={`text-[11px] font-medium ${ptOnline ? 'text-success' : 'text-muted-foreground'}`}>
                {ptOnline ? 'Online now' : 'Offline'}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">Connect with a PT to start chatting</p>
            )}
          </div>
        </div>
      </div>

      {/* Safety notice */}
      {pt && messages.length === 0 && !isLoading && (
        <div className="relative mx-3 md:mx-4 mt-3 flex items-start gap-2 bg-amber-50/80 backdrop-blur-sm border border-amber-200/60 text-amber-900 text-[11px] rounded-xl p-2.5 z-10">
          <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Chat is for non-urgent communication with your physiotherapist. If this is a medical emergency, call your local emergency number.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto overscroll-contain px-3 md:px-4 py-4 space-y-1.5 z-[1] scrollbar-thin">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`h-10 rounded-2xl animate-pulse ${
                    i % 2 === 0 ? 'w-40 bg-primary/20' : 'w-52 bg-muted'
                  }`}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-[0_8px_30px_-10px_rgba(27,62,143,0.5)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="font-display font-semibold text-sm mb-1">Start the conversation</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Ask questions about your plan, log how a session felt, or send a photo of your progress.
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div
        className="relative border-t border-border/60 bg-card/70 backdrop-blur-xl flex-shrink-0 z-10"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {!pt ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Link a physiotherapist to start messaging
          </p>
        ) : (
          <div className="p-3 md:p-4">
            {file && (
              <div className="mb-2">
                <ChatFilePreview file={file} onRemove={() => setFile(null)} />
              </div>
            )}
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
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
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
                disabled={(!text.trim() && !file) || sendMutation.isPending}
                aria-label="Send message"
                className="w-11 h-11 gradient-pink rounded-2xl flex items-center justify-center text-white shadow-[0_6px_20px_-6px_rgba(229,25,125,0.6)] hover:shadow-[0_6px_22px_-4px_rgba(229,25,125,0.7)] active:scale-95 disabled:opacity-40 disabled:shadow-none transition-all flex-shrink-0"
              >
                <Send size={17} className="translate-x-[1px]" />
              </button>
            </div>
            {text.length > 4500 && (
              <p className="text-[10px] text-muted-foreground mt-1 text-right">{text.length} / 5000</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
