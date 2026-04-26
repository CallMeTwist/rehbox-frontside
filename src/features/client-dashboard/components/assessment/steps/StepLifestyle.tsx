import { useAssessment } from '../AssessmentContext';
import type { AlcoholConsumption } from '../AssessmentContext';

const ALCOHOL: { value: AlcoholConsumption; label: string }[] = [
  { value: 'rarely', label: 'Rarely 🍵' },
  { value: 'occasionally', label: 'Occasionally 🍷' },
  { value: 'all_the_time', label: 'All the time 🍻' },
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

const StepLifestyle = () => {
  const { data, update } = useAssessment();

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="font-display font-bold text-2xl">Lifestyle 🌿</h2>
        <p className="text-muted-foreground text-sm mt-1">
          A quick peek at the day-to-day.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Do you smoke?</p>
        <div className="flex gap-2">
          <Toggle active={data.smokes === true} onClick={() => update({ smokes: true })}>
            Yes 🚬
          </Toggle>
          <Toggle active={data.smokes === false} onClick={() => update({ smokes: false })}>
            No 🚭
          </Toggle>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Alcohol consumption</p>
        <div className="flex flex-wrap gap-2">
          {ALCOHOL.map((opt) => (
            <Toggle
              key={opt.value}
              active={data.alcohol_consumption === opt.value}
              onClick={() => update({ alcohol_consumption: opt.value })}
            >
              {opt.label}
            </Toggle>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">
          Stress level{' '}
          <span className="text-muted-foreground font-normal">
            ({data.stress_level ?? 5}/10)
          </span>
        </p>
        <input
          type="range"
          min={1}
          max={10}
          value={data.stress_level ?? 5}
          onChange={(e) => update({ stress_level: Number(e.target.value) })}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Chill 😌</span>
          <span>Frazzled 🤯</span>
        </div>
      </div>
    </div>
  );
};

export default StepLifestyle;
