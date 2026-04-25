import { useNavigate } from "react-router-dom";
import { Crown, X } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  feature: string;
  description?: string;
  onClose: () => void;
}

const UpgradeModal = ({ open, feature, description, onClose }: UpgradeModalProps) => {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-card border border-border relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>
        <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-primary">
          <Crown size={24} className="text-white" />
        </div>
        <h3 className="font-display font-bold text-xl text-center mb-2">Upgrade to unlock {feature}</h3>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {description ?? `${feature} is available on the Standard plan. Upgrade to get personalized exercises, PT chat, motion tracking and more.`}
        </p>
        <button
          onClick={() => navigate('/subscription')}
          className="w-full gradient-primary text-white font-bold py-3 rounded-xl shadow-primary hover:opacity-90 mb-2"
        >
          View Plans
        </button>
        <button onClick={onClose} className="w-full text-sm text-muted-foreground font-medium py-2">
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default UpgradeModal;
