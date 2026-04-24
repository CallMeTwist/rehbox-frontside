// src/features/shared/components/chat/ChatPrimitives.tsx
import { Check, CheckCheck } from 'lucide-react';
import { MessageFile } from '@/features/client-dashboard/components/ChatFilePreview';

type ChatMessage = {
  id: number;
  body?: string;
  sender_id: number;
  receiver_id?: number;
  file_url?: string | null;
  file_type?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  read_at?: string | null;
  created_at: string;
  sender?: { name?: string; role?: string };
};

export function DaySeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center my-4">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-card/60 backdrop-blur-md border border-border/50 px-3 py-1 rounded-full">
        {label}
      </span>
    </div>
  );
}

export function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border/60 shadow-sm px-4 py-2.5 rounded-2xl rounded-bl-md">
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce" />
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">{name} is typing</span>
      </div>
    </div>
  );
}

interface ChatBubbleProps {
  msg: ChatMessage;
  isOwn: boolean;
  showTail: boolean;
  showTime: boolean;
  isRead?: boolean;
  showSenderName?: boolean;
}

export function ChatBubble({ msg, isOwn, showTail, showTime, isRead, showSenderName }: ChatBubbleProps) {
  const time = new Date(msg.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const roundedCorners = isOwn
    ? showTail
      ? 'rounded-2xl rounded-br-md'
      : 'rounded-2xl'
    : showTail
      ? 'rounded-2xl rounded-bl-md'
      : 'rounded-2xl';

  const bubbleBg = isOwn
    ? 'gradient-primary text-white shadow-[0_4px_20px_-4px_rgba(27,62,143,0.4)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none'
    : 'bg-card/85 backdrop-blur-sm border border-border/60 text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)]';

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`relative max-w-[78%] md:max-w-[65%] px-4 py-2.5 ${roundedCorners} ${bubbleBg}`}
      >
        {showSenderName && !isOwn && msg.sender?.name && (
          <p className="text-[10px] font-semibold mb-0.5 text-primary/70">{msg.sender.name}</p>
        )}
        {msg.body && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words relative z-[1]">{msg.body}</p>
        )}
        {msg.file_url && (
          <div className="relative z-[1]">
            <MessageFile
              fileUrl={msg.file_url}
              fileType={msg.file_type ?? ''}
              fileName={msg.file_name ?? 'file'}
              fileSize={msg.file_size ?? 0}
            />
          </div>
        )}
        {showTime && (
          <div
            className={`flex items-center gap-1 justify-end mt-1 relative z-[1] ${
              isOwn ? 'text-white/70' : 'text-muted-foreground'
            }`}
          >
            <span className="text-[10px] leading-none">{time}</span>
            {isOwn && (
              <span className="flex items-center">
                {isRead ? (
                  <CheckCheck size={12} className="text-sky-200" />
                ) : (
                  <Check size={12} />
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Group consecutive messages from the same sender that are within 2 minutes
 * of each other. Returns flags for where to show tail / sender name / time.
 */
export function annotateMessages<T extends ChatMessage>(messages: T[]) {
  return messages.map((msg, i) => {
    const prev = messages[i - 1];
    const next = messages[i + 1];

    const sameSenderAsPrev =
      prev &&
      prev.sender_id === msg.sender_id &&
      Math.abs(new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime()) < 120_000;

    const sameSenderAsNext =
      next &&
      next.sender_id === msg.sender_id &&
      Math.abs(new Date(next.created_at).getTime() - new Date(msg.created_at).getTime()) < 120_000;

    return {
      msg,
      showSenderName: !sameSenderAsPrev,
      showTail: !sameSenderAsNext,
      showTime: !sameSenderAsNext,
    };
  });
}

export function dayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(d, today)) return 'Today';
  if (sameDay(d, yesterday)) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export type { ChatMessage };
