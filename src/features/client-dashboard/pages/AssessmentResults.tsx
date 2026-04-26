import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const TIME_FRAME_LABEL: Record<string, string> = {
  '30d': '30 days',
  '60d': '60 days',
  '90d': '90 days',
  '6mo': '6 months',
  '1yr': '1 year',
};

interface ResultsState {
  primary?: string | null;
  timeFrame?: string | null;
}

const AssessmentResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const state = (location.state ?? {}) as ResultsState;

  const primary = state.primary ?? 'your wellbeing';
  const tfLabel = state.timeFrame ? TIME_FRAME_LABEL[state.timeFrame] ?? state.timeFrame : 'the next stretch';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-5 pt-12 pb-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="text-5xl">🎉</div>
          <h1 className="font-display font-bold text-2xl">
            Nice work, {user?.name?.split(' ')[0] ?? 'friend'} — we've got your story.
          </h1>
          <p className="text-muted-foreground text-sm">
            Your focus on <span className="font-semibold text-foreground">{primary}</span>{' '}
            over <span className="font-semibold text-foreground">{tfLabel}</span> is
            locked in. Now let's talk about how far we can go together.
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
          <div>
            <h2 className="font-display font-semibold text-lg">Upgrade to Standard ⭐</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Unlock personalized PT plans, real-time chat, posture-aware sessions, and
              richer progress insights.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/subscription')}
            className="w-full gradient-primary text-white font-semibold py-3 rounded-xl shadow-primary hover:opacity-90"
          >
            Upgrade to Standard
          </button>
          <button
            type="button"
            onClick={() => navigate('/client/home')}
            className="w-full bg-muted text-foreground font-semibold py-3 rounded-xl hover:bg-muted/70"
          >
            Continue with Free
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Free includes our exercise library, daily reminders, basic progress tracking,
          and your assessment summary. You can upgrade any time. 💛
        </p>
      </div>
    </div>
  );
};

export default AssessmentResults;
