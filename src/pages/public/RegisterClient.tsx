import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { mockClient } from "@/mock/data";

const RegisterClient = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", activationCode: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ ...mockClient, name: form.fullName || mockClient.name, email: form.email || mockClient.email, isSubscribed: false }, "mock-token-client");
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "fullName", label: "Full Name", type: "text", placeholder: "Chidi Okafor" },
              { name: "email", label: "Email Address", type: "email", placeholder: "chidi@example.com" },
              { name: "phone", label: "Phone Number", type: "tel", placeholder: "+234 801 234 5678" },
              { name: "password", label: "Password", type: "password", placeholder: "Create a strong password" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1.5">
                PT Activation Code
                <span className="text-muted-foreground font-normal ml-1">(optional)</span>
              </label>
              <input
                type="text"
                name="activationCode"
                value={form.activationCode}
                onChange={handleChange}
                placeholder="REHBOX-PT-XXXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <p className="text-xs text-muted-foreground mt-1">Get this code from your assigned physiotherapist.</p>
            </div>

            <button
              type="submit"
              className="w-full gradient-primary text-white font-bold py-3 rounded-xl shadow-primary hover:opacity-90 transition-opacity mt-2"
            >
              Create Account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Are you a physiotherapist?{" "}
          <Link to="/register/physiotherapist" className="text-primary font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterClient;
