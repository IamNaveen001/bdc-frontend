import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const session = await login(form.email, form.password);
      navigate(session.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!form.email) {
      setError("Please enter your email to reset password.");
      return;
    }

    try {
      await resetPassword(form.email);
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send reset email.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const session = await loginWithGoogle();
      navigate(session.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message || "Failed to login with Google");
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
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Login to TCE-NSS Blood Donation Portal
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {message && (
            <div className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
              {message}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3
                text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
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
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3
                text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
              />
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-semibold text-red-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-gradient-to-r
              from-red-600 to-red-700 px-4 py-3 text-sm font-bold text-white
              shadow-lg transition hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
            >
              Continue with Google
            </button>
          </form>

          {/* FOOTER */}
          <p className="mt-6 text-center text-sm text-slate-500">
            New here?{" "}
            <Link
              to="/signup"
              className="font-bold text-red-600 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
