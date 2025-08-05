import { Outlet } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";

export default function MainLayout({}) {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <HamburgerMenu />

      {/* Page Content */}
      {/* className="pt-16" */}
      <main className="">
        < Outlet />
      </main>
    </div>
  );
}