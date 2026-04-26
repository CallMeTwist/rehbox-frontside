import { Outlet, NavLink, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, ClipboardList, Dumbbell, TrendingUp, Gift, ShoppingBag,
  MessageCircle, User, LogOut, Menu, ChevronLeft, Bell as BellIcon, Clock
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useOnlineUsers } from "@/features/shared/hooks/useOnlineUsers";
import NotificationBell from "@/features/shared/components/NotificationBell";
import LanguageSelector from "@/features/client-dashboard/components/LanguageSelector";
import CoinWallet from "@/features/client-dashboard/components/CoinWallet";
import { InstallPrompt } from "./InstallPrompt";

const navItems = [
  { to: "/client/home", icon: LayoutDashboard, label: "Home" },
  { to: "/client/plan", icon: ClipboardList, label: "My Plan" },
  { to: "/client/exercises", icon: Dumbbell, label: "Exercises" },
  { to: "/client/progress", icon: TrendingUp, label: "Progress" },
  { to: "/client/rewards", icon: Gift, label: "Rewards" },
  { to: "/client/shop", icon: ShoppingBag, label: "Shop" },
  { to: "/client/chat", icon: MessageCircle, label: "Chat" },
  { to: "/client/reminders", icon: Clock, label: "Reminders" },
  { to: "/client/profile", icon: User, label: "Profile" },
];

const ClientLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "client") return <Navigate to="/" replace />;

  // Joining the presence channel here ensures the PT can see this client as online
  useOnlineUsers();

  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl gradient-pink flex items-center justify-center flex-shrink-0" style={{ boxShadow: 'var(--shadow-pink)' }}>
          <span className="text-white font-display font-bold text-sm">Rx</span>
        </div>
        {sidebarOpen && <span className="text-white font-display font-bold text-xl tracking-tight">ReHboX</span>}
      </div>
      {sidebarOpen && (
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'hsl(var(--sidebar-accent))' }}>
            <div className="w-10 h-10 rounded-full gradient-pink flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.name}</p>
              <p className="text-sidebar-foreground text-xs">Patient</p>
            </div>
          </div>
        </div>
      )}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${isActive ? "text-white shadow-pink" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"}`}
            style={({ isActive }) => isActive ? { background: 'hsl(var(--hot-pink))' } : {}}>
            {({ isActive }) => (<><Icon size={18} className={isActive ? "text-white" : "text-sidebar-foreground group-hover:text-white"} />{sidebarOpen && <span>{label}</span>}</>)}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-sidebar-border">
        {sidebarOpen && <div className="coin-badge mb-3 w-full justify-center"><span>🪙</span><span>{(user.coin_balance || 0).toLocaleString()} coins</span></div>}
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-colors">
          <LogOut size={18} />{sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className={`hidden md:flex flex-col transition-all duration-300 flex-shrink-0 ${sidebarOpen ? "w-60" : "w-16"}`} style={{ background: 'hsl(var(--sidebar-background))' }}>
        <SidebarContent />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col" style={{ background: 'hsl(var(--sidebar-background))' }}><SidebarContent /></aside>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => { toggleSidebar(); setMobileOpen(!mobileOpen); }} className="p-2 rounded-lg hover:bg-muted transition-colors">
              {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
            </button>
            <span className="font-display font-bold md:hidden" style={{ color: 'hsl(var(--hot-pink))' }}>ReHboX</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <CoinWallet coins={user.coin_balance || 0} />
            <NotificationBell />
            <div className="w-8 h-8 rounded-full gradient-pink flex items-center justify-center text-white font-bold text-xs border-2 border-border">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6"><Outlet /></main>
      </div>
      <InstallPrompt />
    </div>
  );
};

export default ClientLayout;
