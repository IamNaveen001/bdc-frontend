import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  name: "",
  bloodGroup: "A+",
  age: 18,
  gender: "Male",
  phone: "",
  email: "",
  location: "",
  lastDonationDate: "",
};

export default function DonorRegistration() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("");
  const [eligibility, setEligibility] = useState("");

  useEffect(() => {
    api
      .get("/api/donors/me")
      .then((res) => {
        const donor = res.data;
        setForm({
          name: donor.name || "",
          bloodGroup: donor.bloodGroup || "A+",
          age: donor.age || 18,
          gender: donor.gender || "Male",
          phone: donor.phone || "",
          email: donor.email || "",
          location: donor.location || "",
          lastDonationDate: donor.lastDonationDate
            ? donor.lastDonationDate.slice(0, 10)
            : "",
        });
      })
      .catch(() => {});
  }, []);

  // 🩸 Eligibility calculation (90 days rule)
  useEffect(() => {
    if (!form.lastDonationDate) {
      setEligibility("You are eligible to donate now ✅");
      return;
    }

    const last = new Date(form.lastDonationDate);
    const today = new Date();
    const diffDays = Math.floor(
      (today - last) / (1000 * 60 * 60 * 24)
    );

    if (diffDays >= 90) {
      setEligibility("You are eligible to donate now ✅");
    } else {
      setEligibility(
        `You can donate again in ${90 - diffDays} days ⏳`
      );
    }
  }, [form.lastDonationDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const payload = { ...form };
    if (!payload.lastDonationDate) delete payload.lastDonationDate;

    try {
      await api.post("/api/donors", payload);
      setStatus("🎉 Donor profile saved successfully!");
    } catch (err) {
      setStatus(err.message || "❌ Failed to save donor profile");
    }
  };

  return (
    <div className="space-y-16 px-4 md:px-0">

      {/* HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 via-white to-red-100 p-10 shadow-lg max-w-4xl mx-auto">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-red-300/30 blur-3xl" />

        <div className="relative">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Donor Registration
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Keep your details updated so we can reach you during emergencies.
            Your contribution saves lives.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-4xl mx-auto rounded-3xl bg-white p-10 shadow-xl">
        {status && (
          <div className="mb-6 animate-pulse rounded-xl bg-green-50 px-4 py-3
          text-sm font-semibold text-green-700">
            {status}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full Name"
            required
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm
            focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
          />

          <select
            value={form.bloodGroup}
            onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm
            focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
          >
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <input
            type="number"
            min="18"
            max="65"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
            placeholder="Age"
            required
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm
            focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
          />

          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm
            focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
          >
            {["Male","Female","Other"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone Number"
            required
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />

          <input
            value={form.email}
            type="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email Address"
            required
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />

          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Location"
            required
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />

          {/* LAST DONATION */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Last Donation Date <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="date"
              value={form.lastDonationDate}
              onChange={(e) =>
                setForm({ ...form, lastDonationDate: e.target.value })
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            />

            {/* ELIGIBILITY STATUS */}
            <p className="mt-2 text-sm font-semibold text-red-600">
              🩸 {eligibility}
            </p>
          </div>

          <button
            type="submit"
            className="md:col-span-2 rounded-full bg-gradient-to-r
            from-red-600 to-red-700 px-6 py-3 text-sm font-bold text-white
            shadow-lg hover:scale-105 transition"
          >
            Save Donor Profile
          </button>
        </form>
      </section>
    </div>
  );
}
