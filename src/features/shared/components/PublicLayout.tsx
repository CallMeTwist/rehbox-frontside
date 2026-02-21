import { Outlet } from "react-router-dom";

const PublicLayout = () => (
  <div className="min-h-screen bg-background">
    <Outlet />
  </div>
);

export default PublicLayout;
