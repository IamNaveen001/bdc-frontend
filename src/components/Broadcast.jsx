// ...existing code...
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

// --- Helpers ---
const normalizePhone = (p) => (p || "").replace(/\D/g, "");
const isMobile = () =>
  /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);

const waLink = (phone, message) => {
  return `https://wa.me/send?phone=${phone}&text=${encodeURIComponent(
    message
  )}`;
};

const sendMessage = (phone, message) => {
  const url = waLink(phone, message);
  window.open(url, "_blank"); // opens in new tab
};

const sampleContacts = [
  { id: "1", name: "A+ Donors Group", phone: "" }, // empty = user picks contact
  { id: "2", name: "Ravi Kumar", phone: "+919876543210" },
  { id: "3", name: "BloodBank Madurai", phone: "+914524001234" },
];

export default function Broadcast() {
  const [contacts, setContacts] = useState(() => {
    try {
      const s = localStorage.getItem("wa_contacts");
      return s ? JSON.parse(s) : sampleContacts;
    } catch {
      return sampleContacts;
    }
  });

  const [selectedIds, setSelectedIds] = useState([]);

  const [form, setForm] = useState({
    patient: "",
    bloodGroup: "",
    units: "",
    hospital: "",
    location: "",
    neededBy: "", // e.g., Today 5 PM
    contactName: "",
    contactPhone: "",
    extra: "",
  });

  const [copyOk, setCopyOk] = useState(false);

  useEffect(() => {
    localStorage.setItem("wa_contacts", JSON.stringify(contacts));
  }, [contacts]);

  const message = useMemo(() => {
    const lines = [
      "🚨 *Emergency Blood Requirement*",
      form.patient && `Patient: ${form.patient}`,
      form.bloodGroup && `Blood Group: *${form.bloodGroup}*`,
      form.units && `Units Needed: ${form.units}`,
      (form.hospital || form.location) &&
        `Location: ${[form.hospital, form.location]
          .filter(Boolean)
          .join(", ")}`,
      form.neededBy && `Needed By: ${form.neededBy}`,
      (form.contactName || form.contactPhone) &&
        `Contact: ${[form.contactName, form.contactPhone]
          .filter(Boolean)
          .join(" · ")}`,
      form.extra && `Notes: ${form.extra}`,
      "\nPlease share / donate if you can. 🙏",
    ]
      .filter(Boolean)
      .join("\n");

    return lines.trim();
  }, [form]);

  const selected = useMemo(
    () => contacts.filter((c) => selectedIds.includes(c.id)),
    [contacts, selectedIds]
  );

  const broadcast = () => {
    if (!message) {
      alert("Please fill the form to create a message.");
      return;
    }

    if (selected.length === 0) {
      window.open(waLink("", message), "_blank");
      return;
    }

    // ✅ open all selected links directly (no setTimeout)
    selected.forEach((c) => {
      const link = waLink(c.phone, message);
      window.open(link, "_blank");
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1500);
    } catch (e) {
      alert("Copy failed. Select the text and copy manually.");
    }
  };

  const addContact = () => {
    const name = prompt("Contact name (e.g., Donor Group)");
    if (!name) return;
    const phone = prompt(
      "Phone number in international format (e.g., +9198xxxxxxxx). Leave blank to choose inside WhatsApp."
    );
    setContacts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        phone: (phone || "").trim(),
      },
    ]);
  };

  const removeContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const variantIn = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Navbar */}
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            🩸 WhatsApp Blood Alert (No API)
          </h1>
          <div className="text-xs text-gray-500">
            Works with <span className="font-medium">wa.me</span> links — manual
            send.
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-6">
        {/* Form */}
        <motion.section
          {...variantIn}
          initial="initial"
          animate="animate"
          className="bg-white rounded-2xl shadow p-4 md:p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Alert Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="Patient Name"
              placeholder="e.g., John Doe"
              value={form.patient}
              onChange={(v) => setForm({ ...form, patient: v })}
            />
            <TextField
              label="Blood Group"
              placeholder="e.g., A+, O-, B+"
              value={form.bloodGroup}
              onChange={(v) =>
                setForm({ ...form, bloodGroup: v.toUpperCase() })
              }
            />
            <TextField
              label="Units Needed"
              placeholder="e.g., 2"
              value={form.units}
              onChange={(v) => setForm({ ...form, units: v })}
            />
            <TextField
              label="Hospital"
              placeholder="e.g., Apollo Hospital"
              value={form.hospital}
              onChange={(v) => setForm({ ...form, hospital: v })}
            />
            <TextField
              label="Area / City"
              placeholder="e.g., Madurai"
              value={form.location}
              onChange={(v) => setForm({ ...form, location: v })}
            />
            <TextField
              label="Needed By"
              placeholder="e.g., Today 5 PM"
              value={form.neededBy}
              onChange={(v) => setForm({ ...form, neededBy: v })}
            />
            <TextField
              label="Contact Name"
              placeholder="e.g., Naveen"
              value={form.contactName}
              onChange={(v) => setForm({ ...form, contactName: v })}
            />
            <TextField
              label="Contact Phone (+CountryCode)"
              placeholder="e.g., +9190xxxxxxxx"
              value={form.contactPhone}
              onChange={(v) => setForm({ ...form, contactPhone: v })}
            />
            <div className="sm:col-span-2">
              <TextArea
                label="Extra Notes"
                placeholder="Any special requirements, blood bank token, etc."
                value={form.extra}
                onChange={(v) => setForm({ ...form, extra: v })}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-2xl bg-gray-900 text-white shadow hover:shadow-md"
            >
              {copyOk ? "✓ Copied" : "Copy Message"}
            </button>
            <a
              href={waLink("", message)}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-2xl bg-emerald-600 text-white shadow hover:shadow-md"
              onClick={(e) => {
                if (!message) {
                  e.preventDefault();
                  alert("Please fill the form to create a message.");
                }
              }}
            >
              Open in WhatsApp (Choose Contact)
            </a>
          </div>
        </motion.section>

        {/* Preview & Contacts */}
        <motion.section
          {...variantIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl shadow p-4 md:p-6 flex flex-col"
        >
          <h2 className="text-lg font-semibold mb-3">Preview</h2>
          <div className="bg-gray-50 rounded-xl p-3 text-sm whitespace-pre-wrap min-h-[160px] border">
            {message || (
              <span className="text-gray-400">
                Your alert message will appear here…
              </span>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h3 className="font-semibold">Contacts</h3>
            <div className="flex gap-2">
              <button
                onClick={addContact}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-sm shadow hover:shadow-md"
              >
                + Add
              </button>
              <button
                onClick={broadcast}
                className="px-3 py-1.5 rounded-xl bg-green-600 text-white text-sm shadow hover:shadow-md"
              >
                Share to Selected
              </button>
            </div>
          </div>

          <div className="mt-3 grid gap-2">
            {contacts.length === 0 && (
              <div className="text-sm text-gray-500">
                No contacts yet. Add some!
              </div>
            )}
            {contacts.map((c) => (
              <label
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-xl border p-3 hover:bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={selectedIds.includes(c.id)}
                    onChange={(e) => {
                      setSelectedIds((prev) =>
                        e.target.checked
                          ? [...prev, c.id]
                          : prev.filter((x) => x !== c.id)
                      );
                    }}
                  />
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">
                      {c.phone
                        ? normalizePhone(c.phone)
                        : "Pick inside WhatsApp"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={waLink(c.phone, message || "")}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-2 py-1 rounded-lg border hover:bg-gray-100"
                  >
                    Open
                  </a>
                  <button
                    onClick={() => removeContact(c.id)}
                    className="text-xs px-2 py-1 rounded-lg border text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-500 border-t pt-3">
            <p>
              Tip: On <span className="font-medium">mobile</span>, the WhatsApp
              app opens directly. On desktop, WhatsApp Web will open.
            </p>
            <p className="mt-1">
              Limitation: Without the official WhatsApp Business API, messages
              cannot be auto-sent. Each chat must be opened and *you* tap/send.
            </p>
          </div>
        </motion.section>
      </main>

      <footer className="max-w-5xl mx-auto px-4 pb-8 text-xs text-gray-500">
        <div className="mt-6">
          <span className="font-medium">Privacy:</span> Contacts are stored
          locally in your browser (LocalStorage) only.
        </div>
      </footer>
    </div>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm text-gray-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </label>
  );
}
