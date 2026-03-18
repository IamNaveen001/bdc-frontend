import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(form.name, form.email, form.password);

      // ✅ Redirect to verification page
      navigate("/verify-email");
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* TOP GRADIENT */}
        <div className="h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700" />

        <div className="p-10">
          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Join the TCE-NSS Blood Donation Community
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
                focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
                focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm
                focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-gradient-to-r
              from-red-600 to-red-700 px-4 py-3 text-sm font-bold text-white
              shadow-lg transition hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          {/* INFO MESSAGE */}
          <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
            A verification link will be sent to your email address.
          </div>

          {/* FOOTER */}
          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-red-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
