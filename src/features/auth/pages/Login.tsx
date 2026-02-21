// src/features/auth/pages/Login.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { usePTLogin, useClientLogin } from "@/features/auth/hooks/useAuth";

const Login = () => {
  const [role, setRole]         = useState<"physiotherapist" | "client">("client");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // ✅ Real API hooks — no more useAuthStore().login
  const ptLogin     = usePTLogin();
  const clientLogin = useClientLogin();

  const isPending = ptLogin.isPending || clientLogin.isPending;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const creds = { email, password };
    if (role === "physiotherapist") {
      ptLogin.mutate(creds);      // navigates to /pt/home on success
    } else {
      clientLogin.mutate(creds);  // navigates to /client/home on success
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — keep your existing design exactly as-is */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
            <span className="text-white font-display font-bold">Rx</span>
          </div>
          <span className="font-display font-bold text-xl text-white">ReHboX</span>
        </Link>
        <div>
          <h2 className="font-display font-bold text-4xl text-white mb-4">
            Welcome back to your recovery journey
          </h2>
          <p className="text-white/70">Continue where you left off and keep making progress.</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[["🏃", "Track sessions"], ["💊", "Follow plans"], ["🏆", "Earn rewards"]].map(
            ([icon, label]) => (
              <div key={label} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{icon}</div>
                <p className="text-white/80 text-xs">{label}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
              <span className="text-white font-display font-bold">Rx</span>
            </div>
            <span className="font-display font-bold text-xl">ReHboX</span>
          </div>

          <h1 className="font-display font-bold text-2xl mb-1">Sign in</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Welcome back! Please enter your details.
          </p>

          {/* Role toggle */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            {(["client", "physiotherapist"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-all ${
                  role === r
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {r === "client" ? "Patient" : "Physiotherapist"}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full gradient-primary text-white font-bold py-3 rounded-xl shadow-primary hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              to={`/register/${role === "client" ? "client" : "physio"}`}
              className="text-primary font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;