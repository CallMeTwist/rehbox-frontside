import { useAssessment } from '../AssessmentContext';
import type {
  ExerciseHabit,
  BestTime,
  FeedbackFrequency,
  FeedbackChannel,
} from '../AssessmentContext';

const HABITS: { value: ExerciseHabit; label: string }[] = [
  { value: 'newbie', label: 'Newbie 🌱' },
  { value: 'warrior', label: 'Warrior 🥷' },
  { value: 'none', label: 'None 🛋️' },
];

const COMFORT = [
  'Floor work 🧘',
  'Standing 🧍',
  'Resistance bands 🎀',
  'Light weights 🏋️',
  'Bodyweight 🤾',
  'Outdoor walks 🚶',
];

const TIMES: { value: BestTime; label: string }[] = [
  { value: 'morning', label: 'Morning ☀️' },
  { value: 'afternoon', label: 'Afternoon 🌤️' },
  { value: 'evening', label: 'Evening 🌙' },
];

const FREQ: { value: FeedbackFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily 📅' },
  { value: 'weekly', label: 'Weekly 🗓️' },
  { value: 'monthly', label: 'Monthly 📆' },
  { value: 'yearly', label: 'Yearly 🎉' },
];

const FB_TYPES = [
  'Progress reports 📈',
  'Form tips 🎯',
  'Cheers & nudges 💌',
  'Pain/recovery check-in 🩺',
];

const CHANNELS: { value: FeedbackChannel; label: string }[] = [
  { value: 'email', label: 'Email 📧' },
  { value: 'in_person', label: 'In person 🤝' },
  { value: 'whatsapp', label: 'WhatsApp 💬' },
];

const Toggle = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      active
        ? 'gradient-primary text-white shadow-primary'
        : 'bg-muted text-foreground hover:bg-muted/70'
    }`}
  >
    {children}
  </button>
);

const StepHabits = () => {
  const { data, update } = useAssessment();
  const comfort = data.comfort_level ?? [];
  const fbTypes = data.feedback_type ?? [];

  const toggleArr = (
    key: 'comfort_level' | 'feedback_type',
    list: string[],
    val: string
  ) => {
    if (list.includes(val)) update({ [key]: list.filter((x) => x !== val) } as any);
    else update({ [key]: [...list, val] } as any);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="font-display font-bold text-2xl">Habits & feedback 🎈</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Last bit — how do you like to move and hear from us?
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Exercise habit</p>
        <div className="flex flex-wrap gap-2">
          {HABITS.map((h) => (
            <Toggle
              key={h.value}
              active={data.exercise_habit === h.value}
              onClick={() => update({ exercise_habit: h.value })}
            >
              {h.label}
            </Toggle>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Comfort level (pick all that apply)</p>
        <div className="flex flex-wrap gap-2">
          {COMFORT.map((c) => (
            <Toggle
              key={c}
              active={comfort.includes(c)}
              onClick={() => toggleArr('comfort_level', comfort, c)}
            >
              {c}
            </Toggle>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Best time to move</p>
        <div className="flex flex-wrap gap-2">
          {TIMES.map((t) => (
            <Toggle
              key={t.value}
              active={data.best_time === t.value}
              onClick={() => update({ best_time: t.value })}
            >
              {t.label}
            </Toggle>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Feedback frequency</p>
        <div className="flex flex-wrap gap-2">
          {FREQ.map((f) => (
            <Toggle
              key={f.value}
              active={data.feedback_frequency === f.value}
              onClick={() => update({ feedback_frequency: f.value })}
            >
              {f.label}
            </Toggle>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Feedback type (pick all that apply)</p>
        <div className="flex flex-wrap gap-2">
          {FB_TYPES.map((t) => (
            <Toggle
              key={t}
              active={fbTypes.includes(t)}
              onClick={() => toggleArr('feedback_type', fbTypes, t)}
            >
              {t}
            </Toggle>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Preferred channel</p>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((c) => (
            <Toggle
              key={c.value}
              active={data.feedback_channel === c.value}
              onClick={() => update({ feedback_channel: c.value })}
            >
              {c.label}
            </Toggle>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepHabits;
