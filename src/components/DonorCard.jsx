export default function DonorCard({ donor }) {
  // Blood group color mapping
  const bloodColors = {
    "A+": "bg-red-100 text-red-700",
    "A-": "bg-red-200 text-red-800",
    "B+": "bg-blue-100 text-blue-700",
    "B-": "bg-blue-200 text-blue-800",
    "AB+": "bg-purple-100 text-purple-700",
    "AB-": "bg-purple-200 text-purple-800",
    "O+": "bg-green-100 text-green-700",
    "O-": "bg-green-200 text-green-800",
  };

  return (
    <div
      className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg
      transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {donor.name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            📍 {donor.location}
          </p>
        </div>

        {/* BLOOD GROUP BADGE */}
        <span
          className={`rounded-full px-4 py-1 text-sm font-bold shadow-sm
          ${bloodColors[donor.bloodGroup] || "bg-slate-100 text-slate-700"}`}
        >
          {donor.bloodGroup}
        </span>
      </div>

      {/* DETAILS */}
      <div className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        <p>
          <span className="font-semibold text-slate-900">Age:</span>{" "}
          {donor.age}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Gender:</span>{" "}
          {donor.gender}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Phone:</span>{" "}
          {donor.phone}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Email:</span>{" "}
          {donor.email}
        </p>

        {donor.lastDonationDate && (
          <p className="sm:col-span-2">
            <span className="font-semibold text-slate-900">
              Last Donation:
            </span>{" "}
            {new Date(donor.lastDonationDate).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* HOVER ACCENT BAR */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r
      from-red-500 via-red-600 to-red-700 opacity-0
      group-hover:opacity-100 transition" />
    </div>
  );
}
