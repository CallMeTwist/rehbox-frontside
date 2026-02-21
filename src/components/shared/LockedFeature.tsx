import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LockedFeatureProps {
  title?: string;
  message: string;
  ctaLabel: string;
  ctaPath: string;
}

const LockedFeature = ({ title = "Feature Locked", message, ctaLabel, ctaPath }: LockedFeatureProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Lock size={32} className="text-muted-foreground" />
      </div>
      <h3 className="font-display font-bold text-xl mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">{message}</p>
      <button
        onClick={() => navigate(ctaPath)}
        className="gradient-primary text-white font-semibold px-6 py-2.5 rounded-xl shadow-primary hover:opacity-90 transition-opacity"
      >
        {ctaLabel}
      </button>
    </div>
  );
};

export default LockedFeature;
