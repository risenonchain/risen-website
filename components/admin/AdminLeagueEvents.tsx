import React, { useEffect, useState } from "react";

interface LeagueEvent {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

interface Props {
  leagueId: number;
}

export default function AdminLeagueEvents({ leagueId }: Props) {
  const [events, setEvents] = useState<LeagueEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/league/events`); // Optionally filter by leagueId if your API supports it
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [leagueId]);

  // Form state for creating a new event
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", start_date: "", end_date: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const res = await fetch("/api/league/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed to create event");
      setShowForm(false);
      setForm({ name: "", start_date: "", end_date: "" });
      // Refresh events
      const data = await res.json();
      setEvents((prev) => [data, ...prev]);
    } catch (err: any) {
      setFormError(err.message || "Unknown error");
    } finally {
      setFormLoading(false);
    }
  }


  async function handleToggleActive(eventId: number, isActive: boolean) {
    try {
      const res = await fetch(`/api/league/events/${eventId}/active?is_active=${isActive}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed to update event status");
      const updated = await res.json();
      setEvents((prev) => prev.map(ev => ev.id === eventId ? { ...ev, is_active: updated.is_active } : ev));
    } catch (err: any) {
      alert(err.message || "Unknown error");
    }
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">League Events</h3>
      <button
        className="mb-4 bg-amber-400 text-black font-black px-6 py-2 rounded-xl shadow hover:bg-amber-300 transition"
        onClick={() => setShowForm((v) => !v)}
      >
        {showForm ? "Cancel" : "Create New Event"}
      </button>
      {showForm && (
        <form className="mb-6 bg-[#07111d] p-4 rounded-xl" onSubmit={handleCreateEvent}>
          <div className="flex flex-col gap-2 mb-2">
            <input
              className="px-3 py-2 rounded bg-[#030913] text-white border border-white/10"
              placeholder="Event Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <input
              type="date"
              className="px-3 py-2 rounded bg-[#030913] text-white border border-white/10"
              value={form.start_date}
              onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
              required
            />
            <input
              type="date"
              className="px-3 py-2 rounded bg-[#030913] text-white border border-white/10"
              value={form.end_date}
              onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
              required
            />
          </div>
          {formError && <div className="text-red-400 mb-2">{formError}</div>}
          <button
            type="submit"
            className="bg-green-500 text-white font-black px-6 py-2 rounded-xl shadow hover:bg-green-400 transition disabled:opacity-50"
            disabled={formLoading}
          >
            {formLoading ? "Creating..." : "Create Event"}
          </button>
        </form>
      )}
      {loading && <div className="text-white/60">Loading events...</div>}
      {error && <div className="text-red-400">{error}</div>}
      <table className="min-w-full bg-[#07111d] rounded-xl shadow-lg mt-4">
        <thead>
          <tr className="text-amber-400 text-xs uppercase">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Start</th>
            <th className="px-4 py-2">End</th>
            <th className="px-4 py-2">Active</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td className="px-4 py-2 text-center">{event.name}</td>
              <td className="px-4 py-2 text-center">{new Date(event.start_date).toLocaleDateString()}</td>
              <td className="px-4 py-2 text-center">{new Date(event.end_date).toLocaleDateString()}</td>
              <td className="px-4 py-2 text-center">
                {event.is_active ? <span className="text-green-400 font-bold">Yes</span> : <span className="text-white/40">No</span>}
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  className={`px-3 py-1 rounded font-bold text-xs ${event.is_active ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                  onClick={() => handleToggleActive(event.id, !event.is_active)}
                >
                  {event.is_active ? "Close Registration" : "Open Registration"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
