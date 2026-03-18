import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import api from "../services/api";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const bloodGroups = [
    {
      type: "A+",
      description: "A+ is one of the most common blood groups.",
      canDonate: "A+, AB+",
      canReceive: "A+, A-, O+, O-",
    },
    {
      type: "A-",
      description: "A- is less common but vital in emergencies.",
      canDonate: "A+, A-, AB+, AB-",
      canReceive: "A-, O-",
    },
    {
      type: "B+",
      description: "B+ is widely found and frequently needed.",
      canDonate: "B+, AB+",
      canReceive: "B+, B-, O+, O-",
    },
    {
      type: "B-",
      description: "B- is rare and lifesaving.",
      canDonate: "B+, B-, AB+, AB-",
      canReceive: "B-, O-",
    },
    {
      type: "AB+",
      description: "Universal receiver blood group.",
      canDonate: "AB+",
      canReceive: "All groups",
    },
    {
      type: "AB-",
      description: "Rare and precious blood type.",
      canDonate: "AB+, AB-",
      canReceive: "AB-, A-, B-, O-",
    },
    {
      type: "O+",
      description: "Most common blood group worldwide.",
      canDonate: "O+, A+, B+, AB+",
      canReceive: "O+, O-",
    },
    {
      type: "O-",
      description: "Universal donor for red blood cells.",
      canDonate: "All groups",
      canReceive: "O-",
    },
  ];

  useEffect(() => {
    let active = true;

    api
      .get("/api/events")
      .then((res) => {
        if (active) setEvents(res.data);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-24 px-4 md:px-0">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 via-white to-red-100">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-red-300/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-red-200/40 blur-3xl" />

        <div className="relative grid gap-10 p-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-red-600">
              TCE NSS Initiative
            </p>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              Blood Donation <br />
              <span className="text-red-600">Management System</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-600">
              Connecting donors, saving lives, and supporting emergency blood
              requirements across campus and nearby hospitals.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/donor/register"
                className="rounded-full bg-red-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:scale-105 transition"
              >
                Become a Donor
              </Link>

              <Link
                to="/donors"
                className="rounded-full border-2 border-red-600 px-8 py-3 text-sm font-bold text-red-600 hover:bg-red-600 hover:text-white transition"
              >
                Search Donors
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur">
            <h3 className="mb-6 text-xl font-bold text-slate-800">
              Why Donate Blood?
            </h3>

            <ul className="space-y-4 text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <span className="text-red-600 text-lg">🩸</span>
                Save lives during emergencies
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-600 text-lg">🚑</span>
                Support hospitals & patients
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-600 text-lg">❤️</span>
                Become a real-life hero
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Upcoming Blood Camps
          </h2>
          <Link
            to="/events"
            className="text-sm font-bold text-red-600 hover:underline"
          >
            View all events →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {loading ? (
            <p className="text-slate-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-slate-500">No events scheduled yet.</p>
          ) : (
            events.slice(0, 2).map((event) => (
              <EventCard key={event._id} event={event} />
            ))
          )}
        </div>
      </section>

      {/* KNOW YOUR BLOOD */}
      <section className="max-w-6xl mx-auto">
        <h2 className="mb-10 text-center text-3xl font-extrabold text-red-600">
          Know Your Blood ?
        </h2>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {bloodGroups.map((group) => (
            <div
              key={group.type}
              className="group relative h-56 cursor-pointer overflow-hidden rounded-3xl bg-white shadow-lg
              transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
            >
              <div className="flex h-full items-center justify-center">
                <h3 className="text-4xl font-extrabold  transition-opacity duration-300 group-hover:opacity-0">
                  {group.type}
                </h3>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center
              bg-gradient-to-br from-red-600 to-red-700 px-5 text-center text-white
              opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <p className="mb-4 text-base font-medium italic">
                  {group.description}
                </p>
                <p className="mb-2 text-sm">
                  <span className="font-semibold">Donate To:</span>{" "}
                  {group.canDonate}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Receive From:</span>{" "}
                  {group.canReceive}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
