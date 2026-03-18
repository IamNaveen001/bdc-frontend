export default function EventCard({ event }) {
  return (
    <div
      className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg
      transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
          {event.title}
        </h3>

        <span className="whitespace-nowrap rounded-full bg-red-100 px-4 py-1
        text-xs font-bold text-red-700 shadow-sm">
          {new Date(event.date).toLocaleDateString()}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-4 text-sm text-slate-600 leading-relaxed">
        {event.description}
      </p>

      {/* DETAILS */}
      <div className="mt-6 space-y-2 text-sm text-slate-700">
        <p className="flex items-center gap-2">
          📍 <span className="font-semibold">Location:</span> {event.location}
        </p>

        {event.organizer && (
          <p className="flex items-center gap-2">
            🏥 <span className="font-semibold">Organizer:</span>{" "}
            {event.organizer}
          </p>
        )}

        {event.contactPhone && (
          <p className="flex items-center gap-2">
            📞 <span className="font-semibold">Contact:</span>{" "}
            {event.contactPhone}
          </p>
        )}
      </div>

      {/* HOVER ACCENT BAR */}
      <div
        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r
        from-red-500 via-red-600 to-red-700 opacity-0
        group-hover:opacity-100 transition"
      />
    </div>
  );
}
