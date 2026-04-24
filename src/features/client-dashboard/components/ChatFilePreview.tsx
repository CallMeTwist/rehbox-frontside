import { FileText, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

interface ChatFilePreviewProps {
  file: File;
  onRemove: () => void;
}

export const ChatFilePreview = ({ file, onRemove }: ChatFilePreviewProps) => {
  const isImage = file.type.startsWith('image/');
  const sizeKB  = (file.size / 1024).toFixed(1);

  return (
    <div className="relative inline-flex items-center gap-2 border border-border/60 rounded-2xl bg-card/80 backdrop-blur-sm p-2 pr-3 max-w-xs shadow-sm">
      {isImage ? (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          className="w-10 h-10 rounded-xl object-cover flex-shrink-0 ring-1 ring-border/60"
        />
      ) : (
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-[0_4px_14px_-4px_rgba(27,62,143,0.4)]">
          <FileText size={16} className="text-white" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium truncate max-w-[120px]">{file.name}</p>
        <p className="text-xs text-muted-foreground">{sizeKB} KB</p>
      </div>
      <button onClick={onRemove} className="ml-1 p-0.5 text-muted-foreground hover:text-foreground">
        <X size={12} />
      </button>
    </div>
  );
};

interface MessageFileProps {
  fileUrl: string;
  fileType: string;
  fileName: string;
  fileSize: number;
}

async function fetchWithAuth(url: string, token: string): Promise<string> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to load file');
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export const MessageFile = ({ fileUrl, fileType, fileName, fileSize }: MessageFileProps) => {
  const sizeKB = (fileSize / 1024).toFixed(1);
  const token = useAuthStore.getState().token ?? '';
  const isImage = fileType?.startsWith('image/') || fileType === 'image';

  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const open = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const url = await fetchWithAuth(fileUrl, token);
      if (isImage) {
        setBlobUrl(url);
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (isImage) {
    return (
      <div className="mt-1">
        {blobUrl ? (
          <img
            src={blobUrl}
            alt={fileName}
            className="max-w-[220px] rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(blobUrl, '_blank')}
          />
        ) : (
          <button
            onClick={open}
            className="flex items-center gap-2 border border-white/20 rounded-xl px-3 py-2 hover:bg-white/10 transition-colors text-left w-full"
            disabled={loading}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            <span className="text-xs font-medium truncate max-w-[150px]">{fileName}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={open}
      disabled={loading}
      className="mt-1 flex items-center gap-2 border border-white/20 rounded-xl px-3 py-2 hover:bg-white/10 transition-colors text-left w-full"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
      <div className="min-w-0">
        <p className="text-xs font-medium truncate max-w-[150px]">{fileName}</p>
        <p className="text-xs opacity-70">{sizeKB} KB · PDF</p>
      </div>
    </button>
  );
};
