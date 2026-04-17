import { Lock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpgradeLockedProps {
  feature: string;
  requiredPlan?: string;
}

export const UpgradeLocked = ({ feature, requiredPlan = 'Standard' }: UpgradeLockedProps) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
      <Lock size={28} className="text-muted-foreground" />
    </div>
    <h2 className="font-display font-bold text-xl mb-2">{feature} is locked</h2>
    <p className="text-muted-foreground text-sm mb-6 max-w-xs">
      Upgrade to the {requiredPlan} plan to access {feature.toLowerCase()} and personalised care from your PT.
    </p>
    <Link
      to="/subscription"
      className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-white text-sm"
      style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-primary)' }}
    >
      Upgrade to {requiredPlan} <ChevronRight size={14} />
    </Link>
  </div>
);
