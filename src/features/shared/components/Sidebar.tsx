// Sidebar logic is embedded in PTLayout and ClientLayout
// This shared component provides a reusable sidebar shell

interface SidebarProps {
  children: React.ReactNode;
  open: boolean;
}

const Sidebar = ({ children, open }: SidebarProps) => (
  <aside className={`hidden md:flex flex-col transition-all duration-300 flex-shrink-0 ${open ? "w-60" : "w-16"}`} style={{ background: 'hsl(var(--sidebar-background))' }}>
    {children}
  </aside>
);

export default Sidebar;
