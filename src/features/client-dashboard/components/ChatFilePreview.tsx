import { FileText, X, Download } from 'lucide-react';

interface ChatFilePreviewProps {
  file: File;
  onRemove: () => void;
}

export const ChatFilePreview = ({ file, onRemove }: ChatFilePreviewProps) => {
  const isImage = file.type.startsWith('image/');
  const sizeKB  = (file.size / 1024).toFixed(1);

  return (
    <div className="relative inline-flex items-center gap-2 border border-border rounded-xl bg-muted p-2 pr-3 max-w-xs">
      {isImage ? (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText size={16} className="text-primary" />
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

export const MessageFile = ({ fileUrl, fileType, fileName, fileSize }: MessageFileProps) => {
  const sizeKB = (fileSize / 1024).toFixed(1);

  if (fileType?.startsWith('image/') || fileType === 'image') {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-[220px] rounded-xl mt-1 cursor-pointer hover:opacity-90 transition-opacity"
        />
      </a>
    );
  }

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 flex items-center gap-2 border border-white/20 rounded-xl px-3 py-2 hover:bg-white/10 transition-colors"
    >
      <FileText size={16} />
      <div className="min-w-0">
        <p className="text-xs font-medium truncate max-w-[150px]">{fileName}</p>
        <p className="text-xs opacity-70">{sizeKB} KB · PDF</p>
      </div>
      <Download size={12} className="ml-auto opacity-70" />
    </a>
  );
};
