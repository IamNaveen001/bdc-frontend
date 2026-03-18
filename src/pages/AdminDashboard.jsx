import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const emptyDonor = {
  name: '',
  bloodGroup: 'A+',
  age: 18,
  gender: 'Male',
  phone: '',
  email: '',
  location: '',
  lastDonationDate: ''
};

const emptyEvent = {
  title: '',
  description: '',
  date: '',
  location: '',
  organizer: '',
  contactPhone: ''
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const adminSections = [
  { id: 'overview', label: 'Overview', description: 'Live metrics and admin status' },
  { id: 'donors', label: 'Donor CRUD', description: 'Create, edit, and remove donor records' },
  { id: 'events', label: 'Events', description: 'Manage camps and blood drives' },
  { id: 'alerts', label: 'Emergency Alerts', description: 'Target donors by blood group' },
  { id: 'access', label: 'Admin Access', description: 'Authorize secondary admins' }
];

const panelClass =
  'rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]';

const sectionButtonClass = (active) =>
  `w-full rounded-2xl border px-4 py-3 text-left transition ${
    active
      ? 'border-red-500 bg-red-600 text-white shadow-lg'
      : 'border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white'
  }`;

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [donors, setDonors] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [donorSearch, setDonorSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [donorForm, setDonorForm] = useState(emptyDonor);
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [editingDonorId, setEditingDonorId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [emailForm, setEmailForm] = useState({ bloodGroup: 'A+', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [donorRes, eventRes, userRes] = await Promise.all([
      api.get('/api/donors/admin/all'),
      api.get('/api/events'),
      api.get('/api/auth/users')
    ]);
    setDonors(donorRes.data);
    setEvents(eventRes.data);
    setUsers(userRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData().catch((err) => {
      setStatus(err.response?.data?.message || err.message || 'Failed to load admin data');
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const total = donors.length;
    const groups = donors.reduce((acc, donor) => {
      acc[donor.bloodGroup] = (acc[donor.bloodGroup] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      groups,
      upcomingEvents: events.filter((event) => new Date(event.date) >= new Date()).length,
      admins: users.filter((account) => account.role === 'admin').length
    };
  }, [donors, events, users]);

  const filteredDonors = useMemo(() => {
    const query = donorSearch.trim().toLowerCase();
    if (!query) return donors;

    return donors.filter((donor) =>
      [donor.name, donor.bloodGroup, donor.location, donor.phone, donor.email]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [donorSearch, donors]);

  const filteredEvents = useMemo(() => {
    const query = eventSearch.trim().toLowerCase();
    if (!query) return events;

    return events.filter((event) =>
      [event.title, event.description, event.location, event.organizer, event.contactPhone]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [eventSearch, events]);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return users;

    return users.filter((account) =>
      [account.name, account.email, account.role, account.isPrimaryAdmin ? 'primary admin' : 'managed account']
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [userSearch, users]);

  const setFailure = (err, fallback) => {
    const apiErrors = err?.response?.data?.errors;
    if (Array.isArray(apiErrors) && apiErrors.length) {
      setStatus(apiErrors.map((item) => `${item.param || item.path || 'field'}: ${item.msg}`).join(', '));
      return;
    }
    setStatus(err?.response?.data?.message || err.message || fallback);
  };

  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      if (editingDonorId) {
        await api.put(`/api/donors/${editingDonorId}`, donorForm);
        setStatus('Donor updated successfully.');
      } else {
        await api.post('/api/donors/admin', donorForm);
        setStatus('Donor added successfully.');
      }
      setDonorForm(emptyDonor);
      setEditingDonorId(null);
      await loadData();
    } catch (err) {
      setFailure(err, 'Failed to save donor');
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      if (editingEventId) {
        await api.put(`/api/events/${editingEventId}`, eventForm);
        setStatus('Event updated successfully.');
      } else {
        await api.post('/api/events', eventForm);
        setStatus('Event created successfully.');
      }
      setEventForm(emptyEvent);
      setEditingEventId(null);
      await loadData();
    } catch (err) {
      setFailure(err, 'Failed to save event');
    }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      const res = await api.post('/api/email/emergency', emailForm);
      setStatus(res.data.message);
      setEmailForm({ bloodGroup: 'A+', subject: '', message: '' });
    } catch (err) {
      setFailure(err, 'Failed to send emergency notification');
    }
  };

  const handleDeleteDonor = async (id) => {
    setStatus('');
    try {
      await api.delete(`/api/donors/${id}`);
      setStatus('Donor deleted successfully.');
      await loadData();
    } catch (err) {
      setFailure(err, 'Failed to delete donor');
    }
  };

  const handleDeleteEvent = async (id) => {
    setStatus('');
    try {
      await api.delete(`/api/events/${id}`);
      setStatus('Event deleted successfully.');
      await loadData();
    } catch (err) {
      setFailure(err, 'Failed to delete event');
    }
  };

  const handleRoleUpdate = async (id, role) => {
    setStatus('');
    try {
      const res = await api.patch(`/api/auth/users/${id}/role`, { role });
      setUsers((current) => current.map((account) => (account.id === id ? { ...account, ...res.data } : account)));
      setStatus(role === 'admin' ? 'Secondary admin access granted.' : 'Admin access revoked.');
    } catch (err) {
      setFailure(err, 'Failed to update admin access');
    }
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  const escapeCell = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const buildDonorExportRows = (records) =>
    records.map((donor) => ({
      Name: donor.name || '',
      'Blood Group': donor.bloodGroup || '',
      Age: donor.age ?? '',
      Gender: donor.gender || '',
      Phone: donor.phone || '',
      Email: donor.email || '',
      Location: donor.location || '',
      'Last Donation Date': donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : ''
    }));

  const downloadFile = (content, mimeType, filename) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDonorExcelDownload = (scope) => {
    const records = scope === 'filtered' ? filteredDonors : donors;
    const rows = buildDonorExportRows(records);

    if (rows.length === 0) {
      setStatus('No donor records available for export.');
      return;
    }

    const headers = Object.keys(rows[0]);
    const tableRows = rows
      .map(
        (row) =>
          `<tr>${headers.map((header) => `<td>${escapeCell(row[header])}</td>`).join('')}</tr>`
      )
      .join('');

    const content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
    th { background: #e2e8f0; }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>${headers.map((header) => `<th>${escapeCell(header)}</th>`).join('')}</tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`;

    downloadFile(content, 'application/vnd.ms-excel', `donors-${scope}.xls`);
    setStatus(`Donor ${scope} export downloaded as Excel.`);
  };

  const handleDonorPdfDownload = (scope) => {
    const records = scope === 'filtered' ? filteredDonors : donors;
    const rows = buildDonorExportRows(records);

    if (rows.length === 0) {
      setStatus('No donor records available for export.');
      return;
    }

    const headers = Object.keys(rows[0]);
    const tableRows = rows
      .map(
        (row) =>
          `<tr>${headers.map((header) => `<td>${escapeCell(row[header])}</td>`).join('')}</tr>`
      )
      .join('');

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      setStatus('Unable to open print window for PDF export.');
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Donor Export</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
    h1 { margin-bottom: 8px; }
    p { margin-bottom: 20px; color: #475569; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 12px; }
    th { background: #e2e8f0; }
  </style>
</head>
<body>
  <h1>Donor Export</h1>
  <p>Scope: ${escapeCell(scope)} | Records: ${rows.length}</p>
  <table>
    <thead>
      <tr>${headers.map((header) => `<th>${escapeCell(header)}</th>`).join('')}</tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setStatus(`Donor ${scope} export opened for PDF download.`);
  };

  const handleAdminLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebar = (
    <aside className="flex h-full flex-col rounded-[30px] border border-white/60 bg-slate-950/95 p-5 text-white shadow-[0_24px_80px_rgba(2,6,23,0.45)]">
      <div className="border-b border-white/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-300">Admin Control</p>
        <h1 className="mt-3 text-2xl font-black tracking-tight">Blood Bank Console</h1>
        <p className="mt-2 text-sm text-slate-300">Focused workspace for donor operations, events, alerts, and access control.</p>
      </div>

      <div className="mt-6 flex-1 space-y-3">
        {adminSections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => handleSectionChange(section.id)}
            className={sectionButtonClass(activeSection === section.id)}
          >
            <div className="text-sm font-semibold">{section.label}</div>
            <div className={`mt-1 text-xs ${activeSection === section.id ? 'text-red-100' : 'text-slate-500'}`}>
              {section.description}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white">{user?.displayName || user?.email}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-400">Active admin session</p>
        <button
          type="button"
          onClick={handleAdminLogout}
          className="mt-4 w-full rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Logout
        </button>
      </div>
    </aside>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Donors" value={stats.total} />
        <StatCard label="Upcoming Events" value={stats.upcomingEvents} />
        <StatCard label="Admin Accounts" value={stats.admins} />
        <StatCard label="Active Blood Groups" value={Object.keys(stats.groups).length} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className={panelClass}>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-600">Live Inventory</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Blood group distribution</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {bloodGroups.map((group) => (
              <div key={group} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-sm font-semibold text-slate-500">{group}</div>
                <div className="mt-2 text-2xl font-black text-slate-900">{stats.groups[group] || 0}</div>
              </div>
            ))}
          </div>
        </section>

        <section className={panelClass}>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-600">Operations Feed</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Next actions</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Donor records</p>
              <p className="mt-1 text-sm text-slate-600">Review duplicates, update contact details, and keep the emergency list current.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Upcoming camps</p>
              <p className="mt-1 text-sm text-slate-600">There are {stats.upcomingEvents} scheduled events visible to donors right now.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Admin access</p>
              <p className="mt-1 text-sm text-slate-600">{stats.admins} accounts currently have elevated access to the console.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const renderDonors = () => (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className={panelClass}>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-600">CRUD Workspace</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">{editingDonorId ? 'Edit donor record' : 'Create donor record'}</h2>
        <form onSubmit={handleDonorSubmit} className="mt-6 grid gap-3 md:grid-cols-2">
          <input value={donorForm.name} onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })} placeholder="Name" className="rounded-2xl border border-slate-200 px-4 py-3" required />
          <select value={donorForm.bloodGroup} onChange={(e) => setDonorForm({ ...donorForm, bloodGroup: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3">
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <input type="number" min="18" max="65" value={donorForm.age} onChange={(e) => setDonorForm({ ...donorForm, age: Number(e.target.value) })} placeholder="Age" className="rounded-2xl border border-slate-200 px-4 py-3" required />
          <select value={donorForm.gender} onChange={(e) => setDonorForm({ ...donorForm, gender: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3">
            {['Male', 'Female', 'Other'].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <input value={donorForm.phone} onChange={(e) => setDonorForm({ ...donorForm, phone: e.target.value })} placeholder="Phone" className="rounded-2xl border border-slate-200 px-4 py-3" required />
          <input type="email" value={donorForm.email} onChange={(e) => setDonorForm({ ...donorForm, email: e.target.value })} placeholder="Email" className="rounded-2xl border border-slate-200 px-4 py-3" required />
          <input value={donorForm.location} onChange={(e) => setDonorForm({ ...donorForm, location: e.target.value })} placeholder="Location" className="rounded-2xl border border-slate-200 px-4 py-3" required />
          <input type="date" value={donorForm.lastDonationDate} onChange={(e) => setDonorForm({ ...donorForm, lastDonationDate: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3" />
          <div className="flex gap-3 md:col-span-2">
            <button type="submit" className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
              {editingDonorId ? 'Update donor' : 'Add donor'}
            </button>
            {editingDonorId && (
              <button
                type="button"
                onClick={() => {
                  setEditingDonorId(null);
                  setDonorForm(emptyDonor);
                }}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className={panelClass}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-600">Donor Records</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Manage donors</h2>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{filteredDonors.length} records</div>
        </div>
        <input
          type="text"
          value={donorSearch}
          onChange={(e) => setDonorSearch(e.target.value)}
          placeholder="Search donors by name, group, location, phone, or email"
          className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleDonorPdfDownload('filtered')}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Download filtered PDF
          </button>
          <button
            type="button"
            onClick={() => handleDonorExcelDownload('filtered')}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Download filtered Excel
          </button>
          <button
            type="button"
            onClick={() => handleDonorPdfDownload('full')}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Download full PDF
          </button>
          <button
            type="button"
            onClick={() => handleDonorExcelDownload('full')}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Download full Excel
          </button>
        </div>
        <div className="mt-6 space-y-3">
          {filteredDonors.map((donor) => (
            <div key={donor._id} className="rounded-3xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{donor.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {donor.bloodGroup} | {donor.location} | {donor.phone}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{donor.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDonorForm({
                        name: donor.name,
                        bloodGroup: donor.bloodGroup,
                        age: donor.age,
                        gender: donor.gender,
                        phone: donor.phone,
                        email: donor.email,
                        location: donor.location,
                        lastDonationDate: donor.lastDonationDate ? donor.lastDonationDate.slice(0, 10) : ''
                      });
                      setEditingDonorId(donor._id);
                    }}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDeleteDonor(donor._id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredDonors.length === 0 && <p className="text-sm text-slate-500">No donor records match this search.</p>}
        </div>
      </section>
    </div>
  );

  const renderEvents = () => (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className={panelClass}>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-600">Event Publisher</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">{editingEventId ? 'Edit blood drive' : 'Add new event'}</h2>
        <form onSubmit={handleEventSubmit} className="mt-6 space-y-3">
          <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Event title" className="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          <textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Description" rows="4" className="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          <input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Location" className="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          <input value={eventForm.organizer} onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })} placeholder="Organizer" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          <input value={eventForm.contactPhone} onChange={(e) => setEventForm({ ...eventForm, contactPhone: e.target.value })} placeholder="Contact phone" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          <div className="flex gap-3">
            <button type="submit" className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
              {editingEventId ? 'Update event' : 'Publish event'}
            </button>
            {editingEventId && (
              <button
                type="button"
                onClick={() => {
                  setEditingEventId(null);
                  setEventForm(emptyEvent);
                }}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className={panelClass}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-600">Event Queue</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Scheduled events</h2>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{filteredEvents.length} items</div>
        </div>
        <input
          type="text"
          value={eventSearch}
          onChange={(e) => setEventSearch(e.target.value)}
          placeholder="Search events by title, location, organizer, phone, or description"
          className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />
        <div className="mt-6 space-y-3">
          {filteredEvents.map((event) => (
            <div key={event._id} className="rounded-3xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{event.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(event.date).toLocaleDateString()} | {event.location}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{event.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEventForm({
                        title: event.title,
                        description: event.description,
                        date: event.date ? event.date.slice(0, 10) : '',
                        location: event.location,
                        organizer: event.organizer || '',
                        contactPhone: event.contactPhone || ''
                      });
                      setEditingEventId(event._id);
                    }}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDeleteEvent(event._id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && <p className="text-sm text-slate-500">No events match this search.</p>}
        </div>
      </section>
    </div>
  );

  const renderAlerts = () => (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <section className={panelClass}>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-600">Emergency Notification</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Dispatch donor alert</h2>
        <form onSubmit={handleEmail} className="mt-6 space-y-3">
          <select value={emailForm.bloodGroup} onChange={(e) => setEmailForm({ ...emailForm, bloodGroup: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <input value={emailForm.subject} onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })} placeholder="Critical subject line" className="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          <textarea value={emailForm.message} onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })} placeholder="Explain the emergency, hospital location, and response contact." rows="6" className="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          <button type="submit" className="w-full rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
            Send emergency notification
          </button>
        </form>
      </section>

      <section className={panelClass}>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-600">Recipient Context</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Available responders</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {bloodGroups.map((group) => (
            <div key={group} className={`rounded-3xl border px-4 py-4 ${group === emailForm.bloodGroup ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="text-sm font-semibold text-slate-700">{group}</div>
              <div className="mt-2 text-3xl font-black text-slate-900">{stats.groups[group] || 0}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Potential donors</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderAccess = () => (
    <section className={panelClass}>
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-600">Authorization Matrix</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">Secondary admin access</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">
        Primary admins come from the server `ADMIN_EMAILS` list. Use this panel to grant or revoke operational admin access for other authenticated users.
      </p>
      <input
        type="text"
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
        placeholder="Search users by name, email, role, or account type"
        className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
      />
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.22em] text-slate-500">
              <th className="px-4">User</th>
              <th className="px-4">Role</th>
              <th className="px-4">Type</th>
              <th className="px-4">Joined</th>
              <th className="px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((account) => {
              const isSelf = account.email === user?.email;

              return (
                <tr key={account.id} className="bg-slate-50 text-sm text-slate-700">
                  <td className="rounded-l-3xl px-4 py-4">
                    <div className="font-semibold text-slate-900">{account.name || 'Unnamed user'}</div>
                    <div className="text-slate-500">{account.email}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${account.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'}`}>
                      {account.role}
                    </span>
                  </td>
                  <td className="px-4 py-4">{account.isPrimaryAdmin ? 'Primary admin' : 'Managed account'}</td>
                  <td className="px-4 py-4">{new Date(account.createdAt).toLocaleDateString()}</td>
                  <td className="rounded-r-3xl px-4 py-4">
                    {account.isPrimaryAdmin || isSelf ? (
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Locked</span>
                    ) : account.role === 'admin' ? (
                      <button type="button" onClick={() => handleRoleUpdate(account.id, 'user')} className="rounded-full border border-red-200 px-4 py-2 font-semibold text-red-600">
                        Revoke admin
                      </button>
                    ) : (
                      <button type="button" onClick={() => handleRoleUpdate(account.id, 'admin')} className="rounded-full bg-slate-900 px-4 py-2 font-semibold text-white">
                        Grant admin
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredUsers.length === 0 && <p className="mt-4 text-sm text-slate-500">No user accounts match this search.</p>}
      </div>
    </section>
  );

  const sectionContent = {
    overview: renderOverview(),
    donors: renderDonors(),
    events: renderEvents(),
    alerts: renderAlerts(),
    access: renderAccess()
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.18),_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_45%,_#fff1f2_100%)] p-4 md:p-6">
      <div className="mx-auto flex max-w-7xl gap-6">
        <div className="hidden w-80 shrink-0 lg:block">{sidebar}</div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <div className="h-full w-80 p-4" onClick={(e) => e.stopPropagation()}>
              {sidebar}
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="rounded-[30px] border border-white/70 bg-white/70 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 lg:hidden"
                >
                  Menu
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-600">Admin Workspace</p>
                  <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                    {adminSections.find((section) => section.id === activeSection)?.label}
                  </h2>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Signed in</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{user?.displayName || user?.email}</p>
              </div>
            </div>

            {status && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {status}
              </div>
            )}

            {loading ? (
              <div className="py-16 text-center text-sm font-semibold text-slate-500">Loading admin workspace...</div>
            ) : (
              <div className="mt-6">{sectionContent[activeSection]}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
