import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, CheckCircle } from "lucide-react";

const RegisterPT = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "",
    licenseNumber: "", specialization: "", location: "", bio: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/pending-vetting");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
              <span className="text-white font-display font-bold">Rx</span>
            </div>
            <span className="font-display font-bold text-xl">ReHboX</span>
          </Link>
          <h1 className="font-display font-bold text-2xl mb-1">Join as a Physiotherapist</h1>
          <p className="text-muted-foreground text-sm">Complete your profile to get vetted and start onboarding clients.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "gradient-primary text-white shadow-primary" : "bg-muted text-muted-foreground"}`}>
                {step > s ? <CheckCircle size={16} /> : s}
              </div>
              {s < 2 && <div className={`flex-1 h-1 rounded-full transition-all ${step > s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-display font-semibold text-lg mb-4">Personal Information</h2>
                {[
                  { name: "fullName", label: "Full Name", type: "text", placeholder: "Dr. Adaeze Nwosu" },
                  { name: "email", label: "Email Address", type: "email", placeholder: "adaeze@example.com" },
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
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full gradient-primary text-white font-bold py-3 rounded-xl shadow-primary hover:opacity-90 transition-opacity mt-2"
                >
                  Next: Professional Details
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display font-semibold text-lg mb-4">Professional Details</h2>
                {[
                  { name: "licenseNumber", label: "MRTB License Number", placeholder: "MRTB/PT/2019/04521" },
                  { name: "specialization", label: "Specialization", placeholder: "Orthopedic & Sports PT" },
                  { name: "location", label: "Practice Location", placeholder: "Lagos, Nigeria" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                    <input
                      type="text"
                      name={f.name}
                      value={form[f.name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Bio</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell clients about your experience..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                  />
                </div>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors">
                  <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload license certificate</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 border border-border py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
                    Back
                  </button>
                  <button type="submit" className="flex-1 gradient-primary text-white font-bold py-3 rounded-xl shadow-primary hover:opacity-90 transition-opacity">
                    Submit Application
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already registered?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPT;
