import { useState } from 'react';
import { Bell, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReminderBannerProps {
  planTitle: string;
}

const DISMISSED_KEY = 'rehbox-reminder-banner-dismissed';

export const ReminderBanner = ({ planTitle }: ReminderBannerProps) => {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISSED_KEY) === 'true'
  );

  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, 'true');
    setDismissed(true);
  };

  return (
    <div className="border border-primary/25 rounded-2xl p-4 flex items-start gap-3"
         style={{ background: 'rgba(27,62,143,0.06)' }}>
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Bell size={16} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">Set up exercise reminders</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Your PT assigned <span className="font-medium">{planTitle}</span>. Never miss a session.
        </p>
        <Link
          to="/client/reminders"
          onClick={handleDismiss}
          className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-primary"
        >
          Set reminders <ChevronRight size={11} />
        </Link>
      </div>
      <button onClick={handleDismiss} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
        <X size={14} />
      </button>
    </div>
  );
};
