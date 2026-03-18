import { useEffect, useState } from "react";
import api from "../services/api";
import DonorCard from "../components/DonorCard.jsx";

export default function DonorSearch() {
  const [filters, setFilters] = useState({ bloodGroup: "", location: "" });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.bloodGroup) params.bloodGroup = filters.bloodGroup;
      if (filters.location) params.location = filters.location;

      const res = await api.get("/api/donors", { params });
      setDonors(res.data);
    } catch (err) {
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  return (
    <div className="space-y-16 px-4 md:px-0">

      {/* HEADER + FILTER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 via-white to-red-100 p-10 shadow-lg">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-red-300/30 blur-3xl" />

        <div className="relative">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Search Blood Donors
          </h2>
          <p className="mt-3 max-w-xl text-sm text-slate-600">
            Find registered blood donors by blood group and location. Every
            connection here can save a life.
          </p>

          {/* FILTERS */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <select
              value={filters.bloodGroup}
              onChange={(e) =>
                setFilters({ ...filters, bloodGroup: e.target.value })
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3
              text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
            >
              <option value="">All Blood Groups</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <input
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              placeholder="Filter by location"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3
              text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
            />

            <button
              onClick={fetchDonors}
              className="rounded-full bg-gradient-to-r from-red-600 to-red-700
              px-6 py-3 text-sm font-bold text-white shadow-lg
              hover:scale-105 transition"
            >
              Search Donors
            </button>
          </div>
        </div>
      </section>

      {/* DONOR RESULTS */}
      <section>
        <div className="grid gap-6 md:grid-cols-2">
          {loading ? (
            <div className="col-span-full text-center text-slate-500">
              Loading donors...
            </div>
          ) : donors.length === 0 ? (
            <div className="col-span-full text-center text-slate-500">
              No donors found matching your criteria.
            </div>
          ) : (
            donors.map((donor) => (
              <DonorCard key={donor._id} donor={donor} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
