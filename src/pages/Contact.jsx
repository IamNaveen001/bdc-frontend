import { useState } from 'react';
import api from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      setLoading(true);
      await api.post('/api/contact', form);
      setSuccess('Message sent successfully. Admin will contact you soon.');
      setForm({ name: '', contact: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <h1 className="text-3xl font-bold text-center text-red-700">
        Contact Us
      </h1>

      {/* Contact Info */}
      <div className="grid gap-6 rounded-xl bg-white p-6 shadow">
        <div>
          <p className="font-semibold text-slate-700">📞 Mobile</p>
          <p className="text-slate-600">+91 99999 88888</p>
        </div>

        <div>
          <p className="font-semibold text-slate-700">📧 Email</p>
          <p className="text-slate-600">bdctcenss@gmail.com</p>
        </div>
      </div>

      {/* Contact Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl bg-white p-6 shadow"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-red-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Mobile / Email
          </label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-red-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            name="message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-red-600 focus:outline-none"
          />
        </div>

        {success && <p className="text-sm text-green-600">{success}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-red-700 py-2 font-semibold text-white hover:bg-red-800 disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
