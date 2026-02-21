import { useState } from "react";
import { Upload, CheckCircle } from "lucide-react";

interface RegistrationFormProps {
  onSubmit: (data: Record<string, string>) => void;
  type: "pt" | "client";
}

const RegistrationForm = ({ onSubmit, type }: RegistrationFormProps) => {
  const [step, setStep] = useState(1);
  const totalSteps = type === "pt" ? 4 : 1;
  const [form, setForm] = useState<Record<string, string>>({
    fullName: "", email: "", phone: "", password: "",
    licenseNumber: "", specialization: "", location: "", bio: "",
    activationCode: "",
  });
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "pt" && step < totalSteps) {
      setStep(step + 1);
      return;
    }
    onSubmit(form);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  return (
    <div>
      {type === "pt" && (
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i ? "gradient-primary text-white shadow-primary" : step === i + 1 ? "gradient-primary text-white shadow-primary" : "bg-muted text-muted-foreground"}`}>
                {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
              </div>
              {i < totalSteps - 1 && <div className={`flex-1 h-1 rounded-full transition-all ${step > i + 1 ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Personal Info */}
        {(type === "client" || step === 1) && (
          <>
            <h2 className="font-display font-semibold text-lg mb-4">Personal Information</h2>
            {[
              { name: "fullName", label: "Full Name", type: "text", placeholder: "Enter your full name" },
              { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
              { name: "phone", label: "Phone Number", type: "tel", placeholder: "+234 801 234 5678" },
              { name: "password", label: "Password", type: "password", placeholder: "Create a strong password" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} className={inputClass} />
              </div>
            ))}
            {type === "client" && (
              <div>
                <label className="block text-sm font-medium mb-1.5">PT Activation Code <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input type="text" name="activationCode" value={form.activationCode} onChange={handleChange} placeholder="REHBOX-PT-XXXXX" className={`${inputClass} uppercase`} />
                <p className="text-xs text-muted-foreground mt-1">Get this from your assigned physiotherapist.</p>
              </div>
            )}
          </>
        )}

        {/* Step 2: Professional Info (PT only) */}
        {type === "pt" && step === 2 && (
          <>
            <h2 className="font-display font-semibold text-lg mb-4">Professional Details</h2>
            {[
              { name: "licenseNumber", label: "MRTB License Number", placeholder: "MRTB/PT/2019/04521" },
              { name: "specialization", label: "Specialization", placeholder: "Orthopedic & Sports PT" },
              { name: "location", label: "Practice Location", placeholder: "Lagos, Nigeria" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                <input type="text" name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} className={inputClass} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1.5">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell clients about your experience..." rows={3} className={`${inputClass} resize-none`} />
            </div>
          </>
        )}

        {/* Step 3: Document Upload (PT only) */}
        {type === "pt" && step === 3 && (
          <>
            <h2 className="font-display font-semibold text-lg mb-4">Document Upload</h2>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
              <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Upload license certificate</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG · Max 10MB</p>
            </div>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
              <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Upload professional ID</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG · Max 10MB</p>
            </div>
          </>
        )}

        {/* Step 4: Terms (PT only) */}
        {type === "pt" && step === 4 && (
          <>
            <h2 className="font-display font-semibold text-lg mb-4">Terms & Conditions</h2>
            <div className="bg-muted rounded-xl p-4 max-h-48 overflow-y-auto text-sm text-muted-foreground space-y-2">
              <p>By registering as a physiotherapist on ReHboX, you agree to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide accurate professional credentials and documentation</li>
                <li>Maintain patient confidentiality and data privacy</li>
                <li>Follow evidence-based rehabilitation protocols</li>
                <li>Respond to client messages within 24 hours</li>
                <li>Comply with Nigerian Medical Rehabilitation Therapists Board regulations</li>
              </ul>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="rounded border-border" />
              <span className="text-sm">I agree to the Terms & Conditions and Privacy Policy</span>
            </label>
          </>
        )}

        <div className="flex gap-3 pt-2">
          {type === "pt" && step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="flex-1 border border-border py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={type === "pt" && step === 4 && !agreed}
            className="flex-1 gradient-primary text-white font-bold py-3 rounded-xl shadow-primary hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {type === "pt" ? (step < totalSteps ? "Next" : "Submit Application") : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
