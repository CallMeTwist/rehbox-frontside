import { ReactNode } from 'react';
import { useAssessment, inputClass, textareaClass } from '../AssessmentContext';

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block">
    <span className="text-sm font-medium text-foreground mb-1.5 block">{label}</span>
    {children}
  </label>
);

const StepMedical = () => {
  const { data, update } = useAssessment();

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h2 className="font-display font-bold text-2xl">Health & Medical History 🌟</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Your story helps us sculpt the perfect plan.
        </p>
      </div>

      <Field label="Existing medical conditions">
        <textarea
          className={textareaClass}
          placeholder="e.g. lower back pain, asthma…"
          value={data.medical_conditions ?? ''}
          onChange={(e) => update({ medical_conditions: e.target.value })}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Height (cm)">
          <input
            type="number"
            inputMode="numeric"
            className={inputClass}
            placeholder="170"
            value={data.height_cm ?? ''}
            onChange={(e) =>
              update({ height_cm: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </Field>
        <Field label="Weight (kg)">
          <input
            type="number"
            inputMode="numeric"
            className={inputClass}
            placeholder="70"
            value={data.weight_kg ?? ''}
            onChange={(e) =>
              update({ weight_kg: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </Field>
      </div>

      <Field label="Past injuries or surgeries">
        <textarea
          className={textareaClass}
          placeholder="Tell us about anything we should know."
          value={data.past_injuries ?? ''}
          onChange={(e) => update({ past_injuries: e.target.value })}
        />
      </Field>

      <Field label="Allergies">
        <input
          className={inputClass}
          placeholder="e.g. pollen, latex"
          value={data.allergies ?? ''}
          onChange={(e) => update({ allergies: e.target.value })}
        />
      </Field>

      <Field label="Current medications">
        <input
          className={inputClass}
          placeholder="Optional"
          value={data.current_medications ?? ''}
          onChange={(e) => update({ current_medications: e.target.value })}
        />
      </Field>

      <Field label="Family health history">
        <textarea
          className={textareaClass}
          placeholder="Any conditions that run in the family?"
          value={data.family_health_history ?? ''}
          onChange={(e) => update({ family_health_history: e.target.value })}
        />
      </Field>
    </div>
  );
};

export default StepMedical;
