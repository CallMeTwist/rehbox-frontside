// Navbar is integrated into PTLayout and ClientLayout as header bars
// This shared component is available for custom page-level navbars

import { Link } from "react-router-dom";

const Navbar = ({ brandColor = "primary" }: { brandColor?: "primary" | "pink" }) => (
  <nav className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
    <Link to="/" className="flex items-center gap-2">
      <div className={`w-9 h-9 rounded-xl ${brandColor === "pink" ? "gradient-pink" : "gradient-primary"} flex items-center justify-center`}>
        <span className="text-white font-display font-bold text-sm">Rx</span>
      </div>
      <span className="font-display font-bold text-xl">ReHboX</span>
    </Link>
  </nav>
);

export default Navbar;
