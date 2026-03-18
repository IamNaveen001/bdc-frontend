import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
export default function AdminLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = await login(form.email, form.password);
      if (session.role !== 'admin') {
        await logout();
        setError('Access denied. This account is not an admin.');
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Failed to login as admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-8">
        <h2 className="section-title">Admin Login</h2>
        <p className="mt-2 text-sm text-slate-500">Admin access only.</p>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? 'Authenticating...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
