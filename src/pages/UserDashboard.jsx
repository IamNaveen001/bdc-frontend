import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

export default function UserDashboard() {
  const { user } = useAuth();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .get("/api/donors/me")
      .then((res) => active && setDonor(res.data))
      .catch(() => active && setDonor(null))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-12 px-4 md:px-0">

      {/* WELCOME CARD */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 via-white to-red-100 p-8 shadow-lg">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-red-300/30 blur-3xl" />

        <div className="relative">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Welcome, {user?.displayName || "Donor"} 👋
          </h2>
          <p className="mt-3 max-w-xl text-sm text-slate-600">
            Manage your donor profile, track your contribution, and stay updated
            with upcoming TCE-NSS blood donation camps.
          </p>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="grid gap-6 md:grid-cols-2">

        {/* DONOR PROFILE */}
        <div className="rounded-3xl bg-white p-8 shadow-xl transition hover:shadow-2xl">
          <h3 className="text-xl font-bold text-slate-900">
            Your Donor Profile
          </h3>

          {loading ? (
            <p className="mt-4 text-sm text-slate-500">
              Loading your profile...
            </p>
          ) : donor ? (
            <div className="mt-6 space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Blood Group:</span>{" "}
                {donor.bloodGroup}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Location:</span>{" "}
                {donor.location}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Phone:</span>{" "}
                {donor.phone}
              </p>
              {donor.lastDonationDate && (
                <p>
                  <span className="font-semibold text-slate-900">
                    Last Donation:
                  </span>{" "}
                  {new Date(donor.lastDonationDate).toLocaleDateString()}
                </p>
              )}

              <Link
                to="/donor/register"
                className="inline-block mt-4 rounded-full bg-red-600 px-6 py-2
                text-sm font-bold text-white shadow hover:scale-105 transition"
              >
                Update Profile
              </Link>
            </div>
          ) : (
            <div className="mt-6 text-sm text-slate-600">
              <p>You are not registered as a donor yet.</p>
              <Link
                to="/donor/register"
                className="mt-3 inline-block rounded-full border-2 border-red-600
                px-6 py-2 font-bold text-red-600 hover:bg-red-600 hover:text-white transition"
              >
                Register Now
              </Link>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="rounded-3xl bg-white p-8 shadow-xl transition hover:shadow-2xl">
          <h3 className="text-xl font-bold text-slate-900">
            Quick Actions
          </h3>

          <div className="mt-6 flex flex-col gap-4">
            <Link
              to="/donors"
              className="flex items-center justify-between rounded-2xl
              border border-slate-200 px-5 py-4 text-sm font-semibold text-slate-700
              hover:border-red-500 hover:bg-red-50 transition"
            >
              <span>🔍 Search donors near you</span>
              <span>→</span>
            </Link>

            <Link
              to="/events"
              className="flex items-center justify-between rounded-2xl
              border border-slate-200 px-5 py-4 text-sm font-semibold text-slate-700
              hover:border-red-500 hover:bg-red-50 transition"
            >
              <span>📅 View upcoming camps</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
