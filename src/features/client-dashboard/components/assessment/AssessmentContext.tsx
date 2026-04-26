import { createContext, useContext, useState, ReactNode } from 'react';

export type AlcoholConsumption = 'rarely' | 'occasionally' | 'all_the_time';
export type TimeFrame = '30d' | '60d' | '90d' | '6mo' | '1yr';
export type ExerciseHabit = 'newbie' | 'warrior' | 'none';
export type BestTime = 'morning' | 'afternoon' | 'evening';
export type FeedbackFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type FeedbackChannel = 'email' | 'in_person' | 'whatsapp';

export interface AssessmentData {
  // Medical
  medical_conditions?: string;
  height_cm?: number;
  weight_kg?: number;
  past_injuries?: string;
  allergies?: string;
  current_medications?: string;
  family_health_history?: string;
  // Lifestyle
  smokes?: boolean;
  alcohol_consumption?: AlcoholConsumption;
  stress_level?: number;
  // Goals
  primary_goals?: string[];
  time_frame?: TimeFrame;
  // Habits
  exercise_habit?: ExerciseHabit;
  comfort_level?: string[];
  best_time?: BestTime;
  feedback_frequency?: FeedbackFrequency;
  feedback_type?: string[];
  feedback_channel?: FeedbackChannel;
}

interface AssessmentContextValue {
  data: AssessmentData;
  update: (patch: Partial<AssessmentData>) => void;
}

const AssessmentContext = createContext<AssessmentContextValue | undefined>(undefined);

export const AssessmentProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AssessmentData>({});
  const update = (patch: Partial<AssessmentData>) =>
    setData((d) => ({ ...d, ...patch }));
  return (
    <AssessmentContext.Provider value={{ data, update }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment must be used inside AssessmentProvider');
  return ctx;
}

export const inputClass =
  'w-full bg-card border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
export const textareaClass =
  'w-full bg-card border border-border rounded-xl p-3 text-sm resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary';
