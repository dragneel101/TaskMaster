import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();

  const navLinkStyle = (path) =>
    pathname === path
      ? "bg-white text-[#6B3FA0] px-3 py-1 rounded-full font-semibold shadow-sm"
      : "text-white hover:text-gray-200 transition";

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#6B3FA0] to-[#4B2A7C] shadow-xl w-full">
      <div className="flex justify-between items-center w-full px-6 py-4">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-2">
          <span className="text-white text-2xl">✅</span>
          <h1 className="text-2xl font-bold tracking-wide text-white">TaskMaster</h1>
        </div>

        {/* Right: Navigation */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className={navLinkStyle("/")}>Home</Link>
          <Link to="/login" className={navLinkStyle("/login")}>Login</Link>
          <Link to="/dashboard" className={navLinkStyle("/dashboard")}>Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
