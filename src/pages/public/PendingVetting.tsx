import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const steps = [
  { label: "Application submitted", done: true },
  { label: "Documents under review", done: true },
  { label: "License verification", done: false, active: true },
  { label: "Approval & account activation", done: false },
];

const PendingVetting = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-primary">
          <Clock size={36} className="text-white" />
        </div>
        <h1 className="font-display font-bold text-2xl mb-2">Application Under Review</h1>
        <p className="text-muted-foreground mb-8">
          Hi {user?.name || "Doctor"}! Your physiotherapist application is being reviewed by our team. This usually takes <strong>24–48 hours</strong>.
        </p>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border mb-6 text-left">
          <h3 className="font-display font-semibold mb-4">Vetting Progress</h3>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.done ? "bg-success/20 text-success" :
                  step.active ? "gradient-primary text-white shadow-primary animate-pulse-soft" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {step.done ? <CheckCircle size={16} /> : step.active ? <Clock size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <span className={`text-sm ${step.done ? "text-success font-medium" : step.active ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3 text-left mb-6">
          <AlertCircle size={18} className="text-warning flex-shrink-0 mt-0.5" />
          <p className="text-sm text-warning">
            You'll receive an email notification once your account has been approved. Check your spam folder if you don't see it.
          </p>
        </div>

        <Link to="/" className="text-sm text-primary hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default PendingVetting;
