import { AlertTriangle, X } from "lucide-react";

interface PosturePopupProps {
  message: string;
  type: "warning" | "success" | "info";
  onDismiss: () => void;
}

const PosturePopup = ({ message, type, onDismiss }: PosturePopupProps) => {
  const bgClass = type === "warning" ? "bg-warning/10 border-warning/30" : type === "success" ? "bg-success/10 border-success/30" : "bg-primary/10 border-primary/30";
  const textClass = type === "warning" ? "text-warning" : type === "success" ? "text-success" : "text-primary";

  return (
    <div className={`rounded-xl p-3 border flex items-center gap-3 animate-slide-up ${bgClass}`}>
      <AlertTriangle size={18} className={textClass} />
      <p className={`text-sm font-medium flex-1 ${textClass}`}>{message}</p>
      <button onClick={onDismiss} className="p-1 rounded-lg hover:bg-muted"><X size={14} /></button>
    </div>
  );
};

export default PosturePopup;
