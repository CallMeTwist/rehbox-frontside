import { useState } from "react";
import { Star, X } from "lucide-react";

interface RatingModalProps {
  exerciseName: string;
  onSubmit: (rating: number, comment: string) => void;
  onClose: () => void;
}

const RatingModal = ({ exerciseName, onSubmit, onClose }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-slide-up">
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Rate Your Session</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X size={18} /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">How was your {exerciseName} session?</p>
        <div className="flex gap-2 justify-center mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}>
              <Star size={32} className={`transition-colors ${(hover || rating) >= s ? "text-warning fill-warning" : "text-muted"}`} />
            </button>
          ))}
        </div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Any feedback? (optional)" rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none mb-4" />
        <button onClick={() => onSubmit(rating, comment)} disabled={rating === 0}
          className="w-full gradient-primary text-white font-bold py-3 rounded-xl shadow-primary hover:opacity-90 disabled:opacity-40">Submit Rating</button>
      </div>
    </div>
  );
};

export default RatingModal;
