// src/features/pt-dashboard/components/OnboardingTutorial.tsx
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { X, ChevronRight } from 'lucide-react';

const STEPS = [
  {
    title:    'Welcome to ReHboX!',
    body:     'Your application has been approved. Here\'s a quick overview of how to get started.',
    video:    null,
  },
  {
    title:    'Share Your Activation Code',
    body:     'Go to your Profile page to find your unique activation code. Share it with your patients so they can register and link to you.',
    video:    null,
  },
  {
    title:    'Build Exercise Plans',
    body:     'Once a client registers with your code, go to My Clients → select the client → Create Plan. Choose exercises from the library and customize sets, reps, and notes.',
    video:    null,
  },
  {
    title:    'Track Client Progress',
    body:     'You\'ll receive real-time notifications when clients complete sessions. View their form scores and compliance in the Motion Reports section.',
    video:    null,
  },
  {
    title:    'You\'re ready!',
    body:     'Start by sharing your activation code with your first patient. You can onboard up to 5 clients.',
    video:    null,
  },
];

export const OnboardingTutorial = () => {
  const user    = useAuthStore((s) => s.user);
  const [show, setShow]   = useState(false);
  const [step, setStep]   = useState(0);

  useEffect(() => {
    // Show only if PT is newly approved and hasn't seen the tutorial
    const seen = localStorage.getItem(`rehbox-tutorial-${user?.id}`);
    if (user?.role === 'pt' && user?.vetting_status === 'approved' && !seen) {
      setShow(true);
    }
  }, [user]);

  const dismiss = () => {
    localStorage.setItem(`rehbox-tutorial-${user?.id}`, 'seen');
    setShow(false);
  };

  if (!show) return null;

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl border border-border overflow-hidden">
        {/* Progress bar */}
        <div className="flex gap-1 p-4 pb-0">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
              i <= step ? 'bg-primary' : 'bg-muted'
            }`} />
          ))}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="font-display font-bold text-xl">{current.title}</h2>
            <button onClick={dismiss} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            {current.body}
          </p>

          <div className="flex gap-3">
            <button onClick={dismiss}
              className="flex-1 border border-border rounded-xl py-2.5 text-sm font-semibold hover:bg-muted transition">
              Skip
            </button>
            <button
              onClick={() => isLast ? dismiss() : setStep(step + 1)}
              className="flex-1 gradient-primary text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
            >
              {isLast ? 'Get Started' : 'Next'}
              {!isLast && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};