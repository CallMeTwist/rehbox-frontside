import { useState } from "react";
import { Camera, Edit2, Save } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { mockClient } from "@/mock/data";
import CoinWallet from "@/features/client-dashboard/components/CoinWallet";

const Profile = () => {
  const { user } = useAuthStore();
  const client = user || mockClient;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: client.name, email: client.email, phone: "+234 801 234 5678", condition: "Knee Osteoarthritis" });

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
            <img src={client.avatar} alt={client.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-border" />
            <button className="absolute -bottom-1 -right-1 w-7 h-7 gradient-pink rounded-full flex items-center justify-center shadow-sm"><Camera size={12} className="text-white" /></button>
          </div>
          <div>
            <h2 className="font-display font-bold text-xl mb-1">{form.name}</h2>
            <p className="text-muted-foreground text-sm mb-2">{form.condition}</p>
            <CoinWallet coins={client.coins || 850} size="md" />
          </div>
        </div>
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
        <h2 className="font-display font-semibold">Personal Information</h2>
        {[{ label: "Full Name", key: "name", value: form.name }, { label: "Email", key: "email", value: form.email }, { label: "Phone", key: "phone", value: form.phone }, { label: "Condition", key: "condition", value: form.condition }].map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-muted-foreground mb-1">{field.label}</label>
            {editing ? <input type="text" value={field.value} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /> : <p className="text-sm font-medium py-2.5">{field.value}</p>}
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display font-semibold mb-4">Subscription</h2>
        <div className="p-4 rounded-xl gradient-primary text-white flex items-center justify-between">
          <div><p className="font-bold">Pro Plan</p><p className="text-white/70 text-sm">₦7,500/month · Renews Feb 28</p></div>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">Active</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
