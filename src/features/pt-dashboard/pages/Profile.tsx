import { useState } from "react";
import { Camera, Edit2, Save } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { mockPT } from "@/mock/data";
import CoinWallet from "@/features/client-dashboard/components/CoinWallet";
import { useEarnings } from "@/features/pt-dashboard/hooks/useMotionData";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";


function usePTProfile() {
  return useQuery({
    queryKey: ['pt-profile'],
    queryFn:  () => api.get('/pt/profile').then(r => r.data),
  });
}

function useUpdatePTProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, string>) => api.patch('/pt/profile', data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['pt-profile'] }),
  });
}
// ── Earnings section ─────────────────────────────────────────────────
const EarningsSection = () => {
  const { data, isLoading } = useEarnings();

  // Inline tooltip style — no need for external theme file
  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border:          '1px solid hsl(var(--border))',
    borderRadius:    '12px',
    fontSize:        '12px',
    color:           'hsl(var(--foreground))',
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card animate-pulse">
        <div className="h-4 bg-muted rounded w-40 mb-6" />
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="h-20 bg-muted rounded-xl" />
          <div className="h-20 bg-muted rounded-xl" />
        </div>
        <div className="h-36 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-5">
      <h2 className="font-display font-semibold">Earnings Breakdown</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-xl p-4">
          <p className="text-xs text-muted-foreground">This Month</p>
          <p className="font-display font-bold text-xl mt-1">
            ₦{Number(data?.summary?.monthly_earnings ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-muted rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Commission Rate</p>
          <p className="font-display font-bold text-xl mt-1">
            {data?.summary?.commission_rate ?? '15%'}
          </p>
        </div>
      </div>

      {/* 6-month bar chart */}
      {data?.earning_history?.length > 0 ? (
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data.earning_history} barSize={24}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [`₦${Number(v).toLocaleString()}`, 'Earnings']}
            />
            <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-36 bg-muted rounded-xl flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No earnings data yet</p>
        </div>
      )}

      {/* Per-client breakdown */}
      {data?.client_breakdown?.length > 0 && (
        <div className="space-y-2">
          {data.client_breakdown.map((c: any) => (
            <div
              key={c.client_name}
              className="flex items-center justify-between p-3 rounded-xl bg-muted"
            >
              <div>
                <p className="text-sm font-medium">{c.client_name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {c.subscription_plan} plan
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">
                  ₦{Number(c.your_commission).toLocaleString()}
                </p>
                <p className={`text-xs ${
                  c.status === 'active' ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {c.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Profile page ─────────────────────────────────────────────────
// src/features/pt-dashboard/pages/Profile.tsx
// (replace only the Profile component — keep EarningsSection as-is from previous guide)

const Profile = () => {
  const { data, isLoading } = usePTProfile();
  const updateProfile       = useUpdatePTProfile();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:              '',
    specialty:         '',
    city:              '',
    hospital_or_clinic:'',
    bio:               '',
  });

  const ptData   = data?.physiotherapist;
  const userData = data?.user;

  const handleEdit = () => {
    setForm({
      name:               userData?.name ?? '',
      specialty:          ptData?.specialty ?? '',
      city:               ptData?.city ?? '',
      hospital_or_clinic: ptData?.hospital_or_clinic ?? '',
      bio:                ptData?.bio ?? '',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(form);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl animate-pulse">
        <div className="h-8 bg-muted rounded w-32" />
        <div className="bg-card rounded-2xl p-6 border border-border h-36" />
        <div className="bg-card rounded-2xl p-6 border border-border h-64" />
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
          {editing
            ? <><Save size={15} /> {updateProfile.isPending ? 'Saving...' : 'Save'}</>
            : <><Edit2 size={15} /> Edit</>}
        </button>
      </div>

      {/* Avatar + name */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center border-2 border-border">
              <span className="text-white font-display font-bold text-2xl">
                {(userData?.name ?? 'P').charAt(0).toUpperCase()}
              </span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 gradient-primary rounded-full flex items-center justify-center shadow-sm">
              <Camera size={12} className="text-white" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display font-bold text-xl">{userData?.name}</h2>
              {ptData?.vetting_status === 'approved' && (
                <span className="badge-approved">Approved</span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{ptData?.specialty}</p>
            <CoinWallet coins={ptData?.coin_balance ?? 0} size="md" />
          </div>
        </div>
      </div>

      {/* Professional details */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
        <h2 className="font-display font-semibold">Professional Details</h2>
        {[
          { label: "Full Name",        key: "name",               value: editing ? form.name               : (userData?.name ?? '') },
          { label: "Specialty",        key: "specialty",          value: editing ? form.specialty          : (ptData?.specialty ?? '') },
          { label: "City",             key: "city",               value: editing ? form.city               : (ptData?.city ?? '') },
          { label: "Hospital/Clinic",  key: "hospital_or_clinic", value: editing ? form.hospital_or_clinic : (ptData?.hospital_or_clinic ?? '') },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              {field.label}
            </label>
            {editing ? (
              <input
                type="text"
                value={field.value}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm font-medium py-2.5">
                {field.value || <span className="text-muted-foreground">Not set</span>}
              </p>
            )}
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Bio</label>
          {editing ? (
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          ) : (
            <p className="text-sm text-muted-foreground py-2.5">
              {ptData?.bio || <span className="italic">No bio yet</span>}
            </p>
          )}
        </div>
      </div>

      {/* License & activation code — from database */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display font-semibold mb-4">License & Credentials</h2>
        <div className="flex items-center justify-between p-4 rounded-xl bg-success/5 border border-success/30">
          <div>
            <p className="text-sm font-semibold">License Number</p>
            <p className="text-xs text-muted-foreground font-mono">
              {ptData?.license_number ?? '—'}
            </p>
          </div>
          {ptData?.vetting_status === 'approved' && (
            <span className="badge-approved">Verified</span>
          )}
        </div>
        <div className="mt-4 p-4 rounded-xl bg-muted/50">
          <p className="text-xs text-muted-foreground">Activation Code for Clients</p>
          <p className="font-display font-bold text-lg tracking-widest font-mono mt-1">
            {ptData?.activation_code ?? '—'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Share this with your clients to connect · {ptData?.client_count ?? 0}/5 slots used
          </p>
        </div>
      </div>

      {/* Earnings section */}
      <EarningsSection />

    </div>
  );
};

export default Profile;