import { ChevronLeft } from 'lucide-react';

interface Props {
  step: number;
  total: number;
  onBack: () => void;
}

const AssessmentStepper = ({ step, total, onBack }: Props) => (
  <div className="flex items-center gap-3 mb-6">
    {step > 1 ? (
      <button
        type="button"
        onClick={onBack}
        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70"
        aria-label="Back"
      >
        <ChevronLeft size={18} />
      </button>
    ) : (
      <div className="w-9 h-9" />
    )}
    <div className="flex-1 flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full transition-all ${
            i < step ? 'gradient-primary' : 'bg-muted'
          }`}
        />
      ))}
    </div>
    <span className="text-xs text-muted-foreground font-medium">
      {step}/{total}
    </span>
  </div>
);

export default AssessmentStepper;
