import { useAssessment } from '../AssessmentContext';
import type { TimeFrame } from '../AssessmentContext';

const GOALS = [
  'Reduce pain 🩹',
  'Build strength 💪',
  'Improve mobility 🤸',
  'Recover from injury 🩺',
  'Better posture 🧍',
  'Boost energy ⚡',
  'Sleep better 😴',
  'Feel happier 😄',
];

const TIME_FRAMES: { value: TimeFrame; label: string }[] = [
  { value: '30d', label: '30 days' },
  { value: '60d', label: '60 days' },
  { value: '90d', label: '90 days' },
  { value: '6mo', label: '6 months' },
  { value: '1yr', label: '1 year' },
];

const StepGoals = () => {
  const { data, update } = useAssessment();
  const goals = data.primary_goals ?? [];

  const toggle = (g: string) => {
    if (goals.includes(g)) update({ primary_goals: goals.filter((x) => x !== g) });
    else update({ primary_goals: [...goals, g] });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="font-display font-bold text-2xl">Your goals 🎯</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Pick what matters most — choose at least one.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {GOALS.map((g) => {
          const active = goals.includes(g);
          return (
            <button
              key={g}
              type="button"
              onClick={() => toggle(g)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'gradient-primary text-white shadow-primary'
                  : 'bg-muted text-foreground hover:bg-muted/70'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Time frame</p>
        <div className="flex flex-wrap gap-2">
          {TIME_FRAMES.map((tf) => {
            const active = data.time_frame === tf.value;
            return (
              <button
                key={tf.value}
                type="button"
                onClick={() => update({ time_frame: tf.value })}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'gradient-primary text-white shadow-primary'
                    : 'bg-muted text-foreground hover:bg-muted/70'
                }`}
              >
                {tf.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepGoals;
