import { Outlet } from "react-router-dom";
import PublicNav from "@/features/auth/components/public/PublicNav";
import PublicFooter from "@/features/auth/components/public/PublicFooter";

const PublicLayout = () => (
  <div className="min-h-screen" style={{ background: "var(--pub-ink-base)" }}>
    <div className="pub-grain" aria-hidden="true" />
    <PublicNav />
    <main className="relative z-[2]">
      <Outlet />
    </main>
    <PublicFooter />
  </div>
);

export default PublicLayout;
