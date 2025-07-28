import { Outlet } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#EADCF8] px-4 py-6 relative">
      {/* Navigation */}
      <HamburgerMenu />

      {/* Page content */}
      <main className="pt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;