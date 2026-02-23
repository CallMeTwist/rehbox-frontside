// import { useState } from "react";
// import { Upload, CheckCircle } from "lucide-react";

// interface RegistrationFormProps {
//   onSubmit: (data: Record<string, string>) => void;
//   type: "pt" | "client";
// }

// const RegistrationForm = ({ onSubmit, type }: RegistrationFormProps) => {
//   const [step, setStep] = useState(1);
//   const totalSteps = type === "pt" ? 4 : 1;
//   const [form, setForm] = useState<Record<string, string>>({
//     fullName: "", email: "", phone: "", password: "",
//     licenseNumber: "", specialization: "", location: "", bio: "",
//     activationCode: "",
//   });
//   const [agreed, setAgreed] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (type === "pt" && step < totalSteps) {
//       setStep(step + 1);
//       return;
//     }
//     onSubmit(form);
//   };

//   const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

//   return (
//     <div>
//       {type === "pt" && (
//         <div className="flex items-center gap-2 mb-8">
//           {Array.from({ length: totalSteps }).map((_, i) => (
//             <div key={i} className="flex items-center gap-2 flex-1">
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i ? "gradient-primary text-white shadow-primary" : step === i + 1 ? "gradient-primary text-white shadow-primary" : "bg-muted text-muted-foreground"}`}>
//                 {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
//               </div>
//               {i < totalSteps - 1 && <div className={`flex-1 h-1 rounded-full transition-all ${step > i + 1 ? "bg-primary" : "bg-muted"}`} />}
//             </div>
//           ))}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Step 1: Personal Info */}
//         {(type === "client" || step === 1) && (
//           <>
//             <h2 className="font-display font-semibold text-lg mb-4">Personal Information</h2>
//             {[
//               { name: "fullName", label: "Full Name", type: "text", placeholder: "Enter your full name" },
//               { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
//               { name: "phone", label: "Phone Number", type: "tel", placeholder: "+234 801 234 5678" },
//               { name: "password", label: "Password", type: "password", placeholder: "Create a strong password" },
//             ].map((f) => (
//               <div key={f.name}>
//                 <label className="block text-sm font-medium mb-1.5">{f.label}</label>
//                 <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} className={inputClass} />
//               </div>
//             ))}
//             {type === "client" && (
//               <div>
//                 <label className="block text-sm font-medium mb-1.5">PT Activation Code <span className="text-muted-foreground font-normal">(optional)</span></label>
//                 <input type="text" name="activationCode" value={form.activationCode} onChange={handleChange} placeholder="REHBOX-PT-XXXXX" className={`${inputClass} uppercase`} />
//                 <p className="text-xs text-muted-foreground mt-1">Get this from your assigned physiotherapist.</p>
//               </div>
//             )}
//           </>
//         )}

//         {/* Step 2: Professional Info (PT only) */}
//         {type === "pt" && step === 2 && (
//           <>
//             <h2 className="font-display font-semibold text-lg mb-4">Professional Details</h2>
//             {[
//               { name: "licenseNumber", label: "MRTB License Number", placeholder: "MRTB/PT/2019/04521" },
//               { name: "specialization", label: "Specialization", placeholder: "Orthopedic & Sports PT" },
//               { name: "location", label: "Practice Location", placeholder: "Lagos, Nigeria" },
//             ].map((f) => (
//               <div key={f.name}>
//                 <label className="block text-sm font-medium mb-1.5">{f.label}</label>
//                 <input type="text" name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} className={inputClass} />
//               </div>
//             ))}
//             <div>
//               <label className="block text-sm font-medium mb-1.5">Bio</label>
//               <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell clients about your experience..." rows={3} className={`${inputClass} resize-none`} />
//             </div>
//           </>
//         )}

//         {/* Step 3: Document Upload (PT only) */}
//         {type === "pt" && step === 3 && (
//           <>
//             <h2 className="font-display font-semibold text-lg mb-4">Document Upload</h2>
//             <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
//               <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
//               <p className="text-sm font-medium">Upload license certificate</p>
//               <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG · Max 10MB</p>
//             </div>
//             <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
//               <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
//               <p className="text-sm font-medium">Upload professional ID</p>
//               <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG · Max 10MB</p>
//             </div>
//           </>
//         )}

//         {/* Step 4: Terms (PT only) */}
//         {type === "pt" && step === 4 && (
//           <>
//             <h2 className="font-display font-semibold text-lg mb-4">Terms & Conditions</h2>
//             <div className="bg-muted rounded-xl p-4 max-h-48 overflow-y-auto text-sm text-muted-foreground space-y-2">
//               <p>By registering as a physiotherapist on ReHboX, you agree to:</p>
//               <ul className="list-disc pl-5 space-y-1">
//                 <li>Provide accurate professional credentials and documentation</li>
//                 <li>Maintain patient confidentiality and data privacy</li>
//                 <li>Follow evidence-based rehabilitation protocols</li>
//                 <li>Respond to client messages within 24 hours</li>
//                 <li>Comply with Nigerian Medical Rehabilitation Therapists Board regulations</li>
//               </ul>
//             </div>
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="rounded border-border" />
//               <span className="text-sm">I agree to the Terms & Conditions and Privacy Policy</span>
//             </label>
//           </>
//         )}

//         <div className="flex gap-3 pt-2">
//           {type === "pt" && step > 1 && (
//             <button type="button" onClick={() => setStep(step - 1)} className="flex-1 border border-border py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
//               Back
//             </button>
//           )}
//           <button
//             type="submit"
//             disabled={type === "pt" && step === 4 && !agreed}
//             className="flex-1 gradient-primary text-white font-bold py-3 rounded-xl shadow-primary hover:opacity-90 transition-opacity disabled:opacity-40"
//           >
//             {type === "pt" ? (step < totalSteps ? "Next" : "Submit Application") : "Create Account"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RegistrationForm;

// src/features/auth/components/RegistrationForm.tsx
import { useState } from "react";
import { usePTRegister, useClientRegister } from "@/features/auth/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
  type: "pt" | "client";
  onSubmit?: () => void; // kept for compatibility but we handle nav in the hook
}

const RegistrationForm = ({ type }: Props) => {
  const ptRegister = usePTRegister();
  const clientRegister = useClientRegister();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", password: "", password_confirmation: "",
    phone: "", license_number: "", hospital_or_clinic: "",
    specialty: "", city: "", activation_code: "",
  });
  const [credentialFile, setCredentialFile] = useState<File | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // const handleSubmit = () => {
  //   if (type === "pt") {
  //     const fd = new FormData();
  //     Object.entries(form).forEach(([k, v]) => fd.append(k, v));
  //     if (credentialFile) fd.append("credential_document", credentialFile);
  //     fd.append("agreed_to_terms", "1");
  //     ptRegister.mutate(fd);
  //   } else {
  //     clientRegister.mutate({
  //       name:            form.name,
  //       email:           form.email,
  //       password:        form.password,
  //       password_confirmation: form.password_confirmation,
  //       phone:           form.phone,
  //       activation_code: form.activation_code,
  //       agreed_to_terms: "1",
  //     });
  //   }
  // };

  const handleSubmit = () => {
    if (type === 'pt') {
      const fd = new FormData();

      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('password', form.password);
      fd.append('password_confirmation', form.password_confirmation);
      fd.append('phone', form.phone);
      fd.append('license_number', form.license_number);
      fd.append('hospital_or_clinic', form.hospital_or_clinic);
      fd.append('specialty', form.specialty);
      fd.append('city', form.city);
      fd.append('agreed_to_terms', '1');

      if (credentialFile) {
        fd.append('credential_document', credentialFile);
      }

      // 👇 Add this — paste the output here
      console.log('credentialFile state:', credentialFile);
      console.log('credentialFile type:', typeof credentialFile);
      console.log('Is File instance:', credentialFile instanceof File);
      for (const [key, value] of fd.entries()) {
        console.log(key, '→', value);
      }

      ptRegister.mutate(fd);
    }
  };

  const isPending = ptRegister.isPending || clientRegister.isPending;
  const totalSteps = type === "pt" ? 3 : 1;

  return (
    <div className="space-y-5">
      {/* Step indicator — PT only */}
      {type === "pt" && (
        <div className="flex gap-2 mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? "bg-primary" : "bg-muted"
                }`}
            />
          ))}
        </div>
      )}

      {/* ── PT Step 1: Personal ── */}
      {type === "pt" && step === 1 && (
        <>
          <div className="space-y-1">
            <Label>Full Name</Label>
            <Input placeholder="Dr. Adaeze Okafor" value={form.name}
              onChange={(e) => update("name", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" placeholder="you@hospital.com" value={form.email}
              onChange={(e) => update("email", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input placeholder="+234 800 000 0000" value={form.phone}
              onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" value={form.password}
              onChange={(e) => update("password", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Confirm Password</Label>
            <Input type="password" value={form.password_confirmation}
              onChange={(e) => update("password_confirmation", e.target.value)} />
          </div>
        </>
      )}

      {/* ── PT Step 2: Professional ── */}
      {type === "pt" && step === 2 && (
        <>
          <div className="space-y-1">
            <Label>License Number</Label>
            <Input placeholder="NMCN-123456" value={form.license_number}
              onChange={(e) => update("license_number", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Hospital / Clinic</Label>
            <Input placeholder="Lagos University Teaching Hospital" value={form.hospital_or_clinic}
              onChange={(e) => update("hospital_or_clinic", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Specialty</Label>
            <select
              className="w-full border border-input rounded-xl px-3 py-2 text-sm bg-background"
              value={form.specialty}
              onChange={(e) => update("specialty", e.target.value)}
            >
              <option value="">Select specialty</option>
              <option>Musculoskeletal</option>
              <option>Sports Physiotherapy</option>
              <option>Neurological</option>
              <option>Orthopaedic</option>
              <option>General Practice</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label>City</Label>
            <Input placeholder="Lagos" value={form.city}
              onChange={(e) => update("city", e.target.value)} />
          </div>
        </>
      )}

      {/* ── PT Step 3: Documents + Terms ── */}
      {type === "pt" && step === 3 && (
        <>
          {/* Step 3 file upload section */}
          <div
            className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => document.getElementById('cred-upload')?.click()}
          >
            <input
              id="cred-upload"
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {               // ✅ this is the critical part
                const file = e.target.files?.[0];
                if (file) setCredentialFile(file);
              }}
            />
            <p className="text-3xl mb-2">📄</p>
            <p className="text-sm font-medium text-primary">
              {credentialFile
                ? `✅ ${credentialFile.name}` // ← shows filename if correctly captured
                : 'Upload Credentials'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG · max 5MB</p>
          </div>

          <div className="bg-muted rounded-xl p-4 text-xs text-muted-foreground h-28 overflow-y-auto">
            By registering, you agree to ReHboX's terms of use and privacy policy,
            and consent to the 48-hour vetting process conducted by the ReHboX medical team.
            Your data will be handled in compliance with relevant data protection regulations.
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 accent-primary"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)} />
            <span className="text-sm text-muted-foreground">
              I agree to the <span className="text-primary font-medium">Terms & Conditions</span> and{" "}
              <span className="text-primary font-medium">Privacy Policy</span>
            </span>
          </label>
        </>
      )}

      {/* ── Client: single step ── */}
      {type === "client" && (
        <>
          <div className="space-y-1">
            <Label>Full Name</Label>
            <Input placeholder="Your full name" value={form.name}
              onChange={(e) => update("name", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" placeholder="you@email.com" value={form.email}
              onChange={(e) => update("email", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input placeholder="+234 800 000 0000" value={form.phone}
              onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>
              Activation Code{" "}
              <span className="text-muted-foreground font-normal text-xs">(optional)</span>
            </Label>
            <Input
              placeholder="Code from your Physiotherapist"
              value={form.activation_code}
              onChange={(e) => update("activation_code", e.target.value.toUpperCase())}
              className="tracking-widest font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Have a code? Enter it to link with your physiotherapist. You can also add one later.
            </p>
          </div>
          <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" value={form.password}
              onChange={(e) => update("password", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Confirm Password</Label>
            <Input type="password" value={form.password_confirmation}
              onChange={(e) => update("password_confirmation", e.target.value)} />
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 accent-primary"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)} />
            <span className="text-sm text-muted-foreground">
              I agree to the <span className="text-primary font-medium">Terms & Conditions</span>
            </span>
          </label>
        </>
      )}

      {/* ── Navigation buttons ── */}
      <div className="flex gap-3 pt-2">
        {step > 1 && (
          <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {step < totalSteps ? (
          <Button className="flex-1" onClick={() => setStep(step + 1)}>
            Continue
          </Button>
        ) : (
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isPending || !agreedToTerms || (type === "pt" && !credentialFile)}
          >
            {isPending
              ? "Submitting..."
              : type === "pt"
                ? "Submit for Review"
                : "Create Account"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
