import { useEffect, useState } from "react";
import api from "../services/api";
import EventCard from "../components/EventCard.jsx";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .get("/api/events")
      .then((res) => active && setEvents(res.data))
      .catch(() => {})
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-16 px-4 md:px-0">

      {/* HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 via-white to-red-100 p-10 shadow-lg">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-red-300/30 blur-3xl" />

        <div className="relative">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Blood Donation Camps
          </h2>
          <p className="mt-3 max-w-xl text-sm text-slate-600">
            Explore upcoming blood donation camps organized by TCE-NSS and
            partner hospitals. Your participation saves lives.
          </p>
        </div>
      </section>

      {/* EVENTS GRID */}
      <section>
        <div className="grid gap-6 md:grid-cols-2">
          {loading ? (
            <div className="col-span-full text-center text-slate-500">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="col-span-full text-center text-slate-500">
              No blood donation camps available right now.
            </div>
          ) : (
            events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
