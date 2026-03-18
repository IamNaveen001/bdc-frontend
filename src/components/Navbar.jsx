import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import logo from "../assets/nk.jpg";


/*const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300
      ${
        isActive
          ? "bg-red-600 text-white shadow"
          : "text-slate-700 hover:bg-red-50 hover:text-red-700"
      }`
    }
  >
    {children}
  </NavLink>
);*/

const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `relative px-4 py-2 text-sm font-semibold transition-colors
      ${isActive ? "text-red-600" : "text-slate-700 hover:text-red-600"}
      after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-red-600
      after:transition-all after:duration-300
      ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`
    }
  >
    {children}
  </NavLink>
);


export default function Navbar() {
  const { user, role, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const username = user?.displayName || user?.email?.split("@")[0] || "User";

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="pl-16 mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img
  src={logo}
  alt="TCE NSS Logo"
  className="h-11 w-11 rounded-full ring-2 ring-red-600 object-cover animate-heartbeat"
/>

          <div>
            <h1 className="pl-5 text-xl font-extrabold text-slate-800">TCE-NSS</h1>
            <p className="pl-5 text-xs font-semibold text-red-600 tracking-wide">
              Blood Donation
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-2">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/events">Events</NavItem>
          {user && <NavItem to="/donors">Donors</NavItem>}
          {user && <NavItem to="/donor/register">Donate</NavItem>}
          {user && role === "admin" && <NavItem to="/admin">Admin</NavItem>}
          {user && role !== "admin" && <NavItem to="/dashboard">Dashboard</NavItem>}
          <NavItem to="/contact">Contact</NavItem>

          {!user ? (
            <>
              <NavItem to="/login">Login</NavItem>
              <NavItem to="/signup">Signup</NavItem>
            </>
          ) : (
            <>
              <span className="ml-3 max-w-[160px] truncate text-sm font-semibold text-slate-700">
                {username}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-gradient-to-r from-red-600 to-red-700 px-5 py-2 text-sm font-semibold text-white shadow hover:scale-105 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* HAMBURGER */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1"
        >
          <span className={`h-0.5 w-6 bg-slate-800 transition ${open && "rotate-45 translate-y-1.5"}`} />
          <span className={`h-0.5 w-6 bg-slate-800 transition ${open && "opacity-0"}`} />
          <span className={`h-0.5 w-6 bg-slate-800 transition ${open && "-rotate-45 -translate-y-1.5"}`} />
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg">
          <div className="flex flex-col gap-2 px-6 py-4">
            <NavItem to="/" onClick={() => setOpen(false)}>Home</NavItem>
            <NavItem to="/events" onClick={() => setOpen(false)}>Events</NavItem>
            {user && <NavItem to="/donors" onClick={() => setOpen(false)}>Donors</NavItem>}
            {user && <NavItem to="/donor/register" onClick={() => setOpen(false)}>Donate</NavItem>}
            {user && role === "admin" && <NavItem to="/admin" onClick={() => setOpen(false)}>Admin</NavItem>}
            {user && role !== "admin" && <NavItem to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavItem>}
            <NavItem to="/contact" onClick={() => setOpen(false)}>Contact</NavItem>

            {!user ? (
              <>
                <NavItem to="/login" onClick={() => setOpen(false)}>Login</NavItem>
                <NavItem to="/signup" onClick={() => setOpen(false)}>Signup</NavItem>
              </>
            ) : (
              <>
                <div className="mt-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                  Signed in as {username}
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
