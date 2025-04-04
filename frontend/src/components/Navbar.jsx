import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("taskmasterUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setRole(parsedUser.role);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, [pathname]);

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

          {!isLoggedIn && (
            <Link to="/login" className={navLinkStyle("/login")}>Login</Link>
          )}

          {isLoggedIn && (
            <>
              <Link to="/dashboard" className={navLinkStyle("/dashboard")}>Dashboard</Link>
              <button
                onClick={() => {
                  localStorage.removeItem("taskmasterUser");
                  navigate("/"); // ✅ SPA-friendly redirect
                }}
                className="text-white hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
