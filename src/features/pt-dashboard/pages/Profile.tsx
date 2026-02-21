import { useState } from "react";
import { Camera, Edit2, Save } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { mockPT } from "@/mock/data";
import CoinWallet from "@/features/client-dashboard/components/CoinWallet";

const Profile = () => {
  const { user } = useAuthStore();
  const pt = user || mockPT;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: pt.name, specialization: mockPT.specialization, location: mockPT.location, bio: "Dedicated physiotherapist with 6 years of experience in orthopedic and sports rehabilitation." });

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl">My Profile</h1>
        <button onClick={() => setEditing(!editing)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${editing ? "gradient-primary text-white shadow-primary" : "border border-border hover:bg-muted"}`}>
          {editing ? <><Save size={15} /> Save</> : <><Edit2 size={15} /> Edit</>}
        </button>
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img src={pt.avatar} alt={pt.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-border" />
            <button className="absolute -bottom-1 -right-1 w-7 h-7 gradient-primary rounded-full flex items-center justify-center shadow-sm"><Camera size={12} className="text-white" /></button>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1"><h2 className="font-display font-bold text-xl">{form.name}</h2><span className="badge-approved">Approved</span></div>
            <p className="text-muted-foreground text-sm">{form.specialization}</p>
            <CoinWallet coins={pt.coins || 0} size="md" />
          </div>
        </div>
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
        <h2 className="font-display font-semibold">Professional Details</h2>
        {[{ label: "Full Name", key: "name", value: form.name }, { label: "Specialization", key: "specialization", value: form.specialization }, { label: "Location", key: "location", value: form.location }].map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-muted-foreground mb-1">{field.label}</label>
            {editing ? <input type="text" value={field.value} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /> : <p className="text-sm font-medium py-2.5">{field.value}</p>}
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Bio</label>
          {editing ? <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" /> : <p className="text-sm text-muted-foreground py-2.5">{form.bio}</p>}
        </div>
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display font-semibold mb-4">License & Credentials</h2>
        <div className="flex items-center justify-between p-4 rounded-xl bg-success/5 border border-success/30">
          <div><p className="text-sm font-semibold">MRTB License</p><p className="text-xs text-muted-foreground">{mockPT.licenseNumber}</p></div>
          <span className="badge-approved">Verified</span>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-muted/50">
          <p className="text-xs text-muted-foreground">Activation Code for Clients</p>
          <p className="font-display font-bold text-lg tracking-wider">{mockPT.activationCode}</p>
          <p className="text-xs text-muted-foreground mt-1">Share this with your clients to connect</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
