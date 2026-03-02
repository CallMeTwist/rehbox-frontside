// import { useState } from "react";
// import { Camera, Edit2, Save } from "lucide-react";
// import { useAuthStore } from "@/store/authStore";
// import { mockClient } from "@/mock/data";
// import CoinWallet from "@/features/client-dashboard/components/CoinWallet";

// const Profile = () => {
//   const { user } = useAuthStore();
//   const client = user || mockClient;
//   const [editing, setEditing] = useState(false);
//   const [form, setForm] = useState({ name: client.name, email: client.email, phone: "+234 801 234 5678", condition: "Knee Osteoarthritis" });

//   return (
//     <div className="space-y-6 animate-slide-up max-w-2xl">
//       <div className="flex items-center justify-between">
//         <h1 className="font-display font-bold text-2xl">My Profile</h1>
//         <button onClick={() => setEditing(!editing)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${editing ? "gradient-primary text-white shadow-primary" : "border border-border hover:bg-muted"}`}>
//           {editing ? <><Save size={15} /> Save</> : <><Edit2 size={15} /> Edit</>}
//         </button>
//       </div>
//       <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
//         <div className="flex items-center gap-5">
//           <div className="relative">
//             <img src={client.avatar} alt={client.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-border" />
//             <button className="absolute -bottom-1 -right-1 w-7 h-7 gradient-pink rounded-full flex items-center justify-center shadow-sm"><Camera size={12} className="text-white" /></button>
//           </div>
//           <div>
//             <h2 className="font-display font-bold text-xl mb-1">{form.name}</h2>
//             <p className="text-muted-foreground text-sm mb-2">{form.condition}</p>
//             <CoinWallet coins={client.coins || 850} size="md" />
//           </div>
//         </div>
//       </div>
//       <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
//         <h2 className="font-display font-semibold">Personal Information</h2>
//         {[{ label: "Full Name", key: "name", value: form.name }, { label: "Email", key: "email", value: form.email }, { label: "Phone", key: "phone", value: form.phone }, { label: "Condition", key: "condition", value: form.condition }].map((field) => (
//           <div key={field.key}>
//             <label className="block text-sm font-medium text-muted-foreground mb-1">{field.label}</label>
//             {editing ? <input type="text" value={field.value} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /> : <p className="text-sm font-medium py-2.5">{field.value}</p>}
//           </div>
//         ))}
//       </div>
//       <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
//         <h2 className="font-display font-semibold mb-4">Subscription</h2>
//         <div className="p-4 rounded-xl gradient-primary text-white flex items-center justify-between">
//           <div><p className="font-bold">Pro Plan</p><p className="text-white/70 text-sm">₦7,500/month · Renews Feb 28</p></div>
//           <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">Active</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;



// src/features/client-dashboard/pages/Profile.tsx
// src/features/client-dashboard/pages/Profile.tsx

import { useState } from "react";
import { Camera, Edit2, Save, Bell, BellOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useClientProfile, useUpdateClientProfile } from "../hooks/useClientProfile";
import CoinWallet from "@/features/client-dashboard/components/CoinWallet";
import toast from "react-hot-toast";
import { usePushNotifications } from "@/features/shared/hooks/usePushNotification";

const PLAN_LABELS: Record<string, string> = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
};

const PLAN_PRICES: Record<string, string> = {
  basic: "₦5,000/month",
  standard: "₦10,000/month",
  premium: "₦20,000/month",
};

/* ============================
   Notification Toggle Component
============================ */

const NotificationToggle = () => {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  if (!isSupported) return null;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          {isSubscribed ? (
            <Bell size={20} className="text-primary" />
          ) : (
            <BellOff size={20} className="text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="font-semibold text-sm">Exercise Reminders</p>
          <p className="text-xs text-muted-foreground">
            {isSubscribed
              ? "You'll get reminded to exercise"
              : "Enable to get exercise reminders"}
          </p>
        </div>
      </div>

      <button
        onClick={isSubscribed ? unsubscribe : subscribe}
        disabled={isLoading}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          isSubscribed ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
            isSubscribed ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

/* ============================
   Main Profile Component
============================ */

const Profile = () => {
  const { user } = useAuthStore();
  const { data, isLoading } = useClientProfile();
  const updateProfile = useUpdateClientProfile();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  const profileData = data?.user;
  const clientData = data?.client;
  const subData = data?.subscription;

  const handleEdit = () => {
    setForm({
      name: profileData?.name ?? "",
      phone: clientData?.phone ?? "",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(form);
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl animate-pulse">
        <div className="h-8 bg-muted rounded w-40" />
        <div className="bg-card rounded-2xl p-6 border border-border h-36" />
        <div className="bg-card rounded-2xl p-6 border border-border h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl">My Profile</h1>

        <button
          onClick={editing ? handleSave : handleEdit}
          disabled={updateProfile.isPending}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            editing
              ? "gradient-primary text-white shadow-primary"
              : "border border-border hover:bg-muted"
          }`}
        >
          {editing ? (
            <>
              <Save size={15} />{" "}
              {updateProfile.isPending ? "Saving..." : "Save"}
            </>
          ) : (
            <>
              <Edit2 size={15} /> Edit
            </>
          )}
        </button>
      </div>

      {/* Avatar */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center border-2 border-border">
              <span className="text-white font-display font-bold text-2xl">
                {(profileData?.name ?? user?.name ?? "U")
                  .charAt(0)
                  .toUpperCase()}
              </span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 gradient-pink rounded-full flex items-center justify-center shadow-sm">
              <Camera size={12} className="text-white" />
            </button>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl mb-1">
              {profileData?.name ?? user?.name}
            </h2>

            {clientData?.condition && (
              <p className="text-muted-foreground text-sm mb-2">
                {clientData.condition}
              </p>
            )}

            <CoinWallet coins={clientData?.coin_balance ?? 0} size="md" />
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
        <h2 className="font-display font-semibold">Personal Information</h2>

        {[
          {
            label: "Full Name",
            key: "name",
            value: editing ? form.name : profileData?.name ?? "",
          },
          {
            label: "Email",
            key: "email",
            value: profileData?.email ?? "",
            readOnly: true,
          },
          {
            label: "Phone",
            key: "phone",
            value: editing ? form.phone : clientData?.phone ?? "",
          },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              {field.label}
            </label>

            {editing && !field.readOnly ? (
              <input
                type="text"
                value={field.value}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm font-medium py-2.5">
                {field.value || (
                  <span className="text-muted-foreground">Not set</span>
                )}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Subscription */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display font-semibold mb-4">Subscription</h2>

        {subData ? (
          <div className="p-4 rounded-xl gradient-primary text-white flex items-center justify-between">
            <div>
              <p className="font-bold">
                {PLAN_LABELS[subData.plan] ?? subData.plan} Plan
              </p>
              <p className="text-white/70 text-sm">
                {PLAN_PRICES[subData.plan]} · Expires{" "}
                {new Date(subData.expires_at).toLocaleDateString()}
              </p>
            </div>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full capitalize">
              {subData.status}
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-muted flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">
                No Active Subscription
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Subscribe to unlock your personalized plan
              </p>
            </div>
            <a
              href="/subscription"
              className="gradient-primary text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Subscribe
            </a>
          </div>
        )}
      </div>

      {/* Push Notifications */}
      <NotificationToggle />
    </div>
  );
};

export default Profile;
