import { Link, useNavigate } from "react-router-dom";
import RegistrationForm from "@/features/auth/components/RegistrationForm";

const RegisterPT = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-primary"><span className="text-white font-display font-bold">Rx</span></div>
            <span className="font-display font-bold text-xl">ReHboX</span>
          </Link>
          <h1 className="font-display font-bold text-2xl mb-1">Join as a Physiotherapist</h1>
          <p className="text-muted-foreground text-sm">Complete your profile to get vetted and start onboarding clients.</p>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <RegistrationForm type="pt" onSubmit={() => navigate("/pending-vetting")} />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already registered? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPT;
