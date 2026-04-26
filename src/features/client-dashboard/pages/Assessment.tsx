import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import {
  AssessmentProvider,
  useAssessment,
  type AssessmentData,
} from '../components/assessment/AssessmentContext';
import AssessmentStepper from '../components/assessment/AssessmentStepper';
import StepMedical from '../components/assessment/steps/StepMedical';
import StepLifestyle from '../components/assessment/steps/StepLifestyle';
import StepGoals from '../components/assessment/steps/StepGoals';
import StepHabits from '../components/assessment/steps/StepHabits';

const TOTAL_STEPS = 4;

function validateStep(step: number, data: AssessmentData): string | null {
  if (step === 2) {
    if (data.smokes === undefined) return 'Let us know if you smoke.';
    if (!data.alcohol_consumption) return 'Pick an alcohol option.';
    if (!data.stress_level) return 'Set your stress level.';
  }
  if (step === 3) {
    if (!data.primary_goals?.length) return 'Pick at least one goal.';
    if (!data.time_frame) return 'Pick a time frame.';
  }
  if (step === 4) {
    if (!data.exercise_habit) return 'Pick an exercise habit.';
    if (!data.comfort_level?.length) return 'Pick at least one comfort option.';
    if (!data.best_time) return 'Pick the best time of day.';
    if (!data.feedback_frequency) return 'Pick a feedback frequency.';
    if (!data.feedback_type?.length) return 'Pick at least one feedback type.';
    if (!data.feedback_channel) return 'Pick a feedback channel.';
  }
  return null;
}

const AssessmentInner = () => {
  const [step, setStep] = useState(1);
  const { data } = useAssessment();
  const navigate = useNavigate();
  const updateUser = useAuthStore((s) => s.updateUser);

  const submit = useMutation({
    mutationFn: (payload: AssessmentData) => api.post('/client/assessment', payload),
    onSuccess: () => {
      updateUser({ assessmentCompletedAt: new Date().toISOString() });
      toast.success('Assessment saved 🎉');
      navigate('/client/assessment/results', {
        state: {
          primary: data.primary_goals?.[0] ?? null,
          timeFrame: data.time_frame ?? null,
        },
      });
    },
    onError: (err: any) => {
      const errors = err.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0] as string[];
        toast.error(first[0]);
      } else {
        toast.error(err.response?.data?.message ?? 'Could not save assessment.');
      }
    },
  });

  const handleNext = () => {
    const err = validateStep(step, data);
    if (err) {
      toast.error(err);
      return;
    }
    if (step < TOTAL_STEPS) setStep(step + 1);
    else submit.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-5 pt-6 pb-32">
        <AssessmentStepper
          step={step}
          total={TOTAL_STEPS}
          onBack={() => setStep((s) => Math.max(1, s - 1))}
        />

        {step === 1 && <StepMedical />}
        {step === 2 && <StepLifestyle />}
        {step === 3 && <StepGoals />}
        {step === 4 && <StepHabits />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4">
        <div className="max-w-xl mx-auto">
          <button
            type="button"
            onClick={handleNext}
            disabled={submit.isPending}
            className="w-full gradient-primary text-white font-semibold py-3 rounded-xl shadow-primary hover:opacity-90 disabled:opacity-60"
          >
            {submit.isPending
              ? 'Saving…'
              : step === TOTAL_STEPS
              ? 'Submit ✨'
              : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Assessment = () => (
  <AssessmentProvider>
    <AssessmentInner />
  </AssessmentProvider>
);

export default Assessment;
