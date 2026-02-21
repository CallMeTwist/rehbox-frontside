import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { mockClient } from "@/mock/data";
import RegistrationForm from "@/features/auth/components/RegistrationForm";

const RegisterClient = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = (data: Record<string, string>) => {
    login({ ...mockClient, name: data.fullName || mockClient.name, email: data.email || mockClient.email, isSubscribed: false }, "mock-token-client");
    navigate("/subscription");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl gradient-pink flex items-center justify-center" style={{ boxShadow: 'var(--shadow-pink)' }}>
              <span className="text-white font-display font-bold">Rx</span>
            </div>
            <span className="font-display font-bold text-xl">ReHboX</span>
          </Link>
          <h1 className="font-display font-bold text-2xl mb-1">Register as a Patient</h1>
          <p className="text-muted-foreground text-sm">Get your activation code from your physiotherapist to get started.</p>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <RegistrationForm type="client" onSubmit={handleSubmit} />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Are you a physiotherapist? <Link to="/register/physio" className="text-primary font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterClient;
