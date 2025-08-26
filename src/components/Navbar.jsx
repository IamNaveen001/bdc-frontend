import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center p-6 bg-red-600 text-white shadow-md">
      {/* Logo / App name */}
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Uyirkaapan
      </h1>

      {/* Desktop menu */}
      <div className="space-x-6 hidden md:flex items-center">
        <Link to="/">Home</Link>
        <Link to="/finddonor">Find Donor</Link>
        
        <a href="#">Contact</a>
        {user ? (
          <>
            <span className="font-bold">Welcome, {user.name}</span>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="bg-white text-red-600 px-4 py-2 rounded-lg shadow">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/donorregister">Donate</Link>
          </>
        )}
      </div>

      {/* Back button (only show if not on Home) */}
      {location.pathname !== "/" && (
        <button
          onClick={() => navigate(-1)}
          className="md:hidden px-4 py-2 bg-white text-red-600 rounded-lg shadow"
        >
          ← Back
        </button>
      )}
    </nav>
  );
}

export default Navbar;
