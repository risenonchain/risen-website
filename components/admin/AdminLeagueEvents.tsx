import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/api";

interface LeagueEvent {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  current_stage: string;
  created_at: string;
}

interface Props {
  leagueId: number;
}

export default function AdminLeagueEvents({ leagueId }: Props) {
  const [events, setEvents] = useState<LeagueEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchEvents() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/league/events`);
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, [leagueId]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", start_date: "", end_date: "", is_live_visible: false, live_fee_usd: 30 });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const token = localStorage.getItem("risen_admin_token") || localStorage.getItem("rush_token");
      const res = await fetch(`${BASE_URL}/league/events`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-App-Version": "1.1.0"
        },
        body: JSON.stringify(form), // Removed league_id: leagueId
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to create event");
      }
      setShowForm(false);
      setForm({ name: "", start_date: "", end_date: "", is_live_visible: false, live_fee_usd: 30 });
      fetchEvents();
    } catch (err: any) {
      setFormError(err.message || "Unknown error");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleToggleActive(eventId: number, isActive: boolean) {
    try {
      const res = await fetch(`${BASE_URL}/league/events/${eventId}/active?is_active=${isActive}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("risen_admin_token")}`
        },
      });
      if (!res.ok) throw new Error("Failed to update event status");
      const updated = await res.json();
      setEvents((prev) => prev.map(ev => ev.id === eventId ? { ...ev, is_active: updated.is_active } : ev));
    } catch (err: any) {
      alert(err.message || "Unknown error");
    }
  }

  return (
    <div className="bg-[#07111d] p-6 rounded-3xl border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-white uppercase tracking-widest italic">League Events</h3>
        <button
            className="bg-amber-400 text-black font-black px-6 py-2 rounded-xl shadow-lg hover:bg-amber-300 transition-all active:scale-95 text-xs uppercase tracking-widest"
            onClick={() => setShowForm(!showForm)}
        >
            {showForm ? "Cancel Protocol" : "Initialize New Event"}
        </button>
      </div>

      {showForm && (
        <form className="mb-8 bg-[#030913] p-6 rounded-2xl border border-amber-400/20" onSubmit={handleCreateEvent}>
          <div className="grid gap-4 mb-4">
            <input
              className="px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 text-xs font-bold uppercase outline-none focus:border-amber-400/50"
              placeholder="Protocol Name (e.g. Neural League S2)"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-white/40 uppercase font-black ml-2">Activation Date</label>
                    <input
                        type="date"
                        className="px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 text-xs font-bold outline-none focus:border-amber-400/50"
                        value={form.start_date}
                        onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-white/40 uppercase font-black ml-2">Termination Date</label>
                    <input
                        type="date"
                        className="px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 text-xs font-bold outline-none focus:border-amber-400/50"
                        value={form.end_date}
                        onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Enable Live Broadcast</span>
                    <input
                        type="checkbox"
                        checked={form.is_live_visible}
                        onChange={e => setForm({...form, is_live_visible: e.target.checked})}
                        className="h-5 w-5 rounded bg-black border-white/10"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-white/40 uppercase font-black ml-2">Access Fee (USD Cents)</label>
                    <input
                        type="number"
                        className="px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 text-xs font-bold outline-none focus:border-amber-400/50"
                        value={form.live_fee_usd}
                        onChange={e => setForm({...form, live_fee_usd: Number(e.target.value)})}
                    />
                </div>
            </div>
          </div>
          {formError && <div className="text-red-400 text-xs font-bold mb-4 ml-2">{formError}</div>}
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white font-black px-6 py-3 rounded-xl shadow-lg hover:bg-emerald-400 transition-all active:scale-95 text-xs uppercase tracking-widest"
            disabled={formLoading}
          >
            {formLoading ? "Synchronizing..." : "Create Event"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
            <thead>
            <tr className="text-white/40 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                <th className="px-4 py-3">Event Name</th>
                <th className="px-4 py-3 text-center">Lifecycle</th>
                <th className="px-4 py-3 text-center">Stage</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Protocol Action</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {events.map((event) => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-4 text-white font-black italic uppercase tracking-tighter">{event.name}</td>
                <td className="px-4 py-4 text-center">
                    <div className="text-[10px] text-white font-bold">{new Date(event.start_date).toLocaleDateString()}</div>
                    <div className="text-[8px] text-white/20 font-black uppercase tracking-widest mt-1">To {new Date(event.end_date).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-4 text-center">
                    <span className="text-amber-400 text-[9px] font-black uppercase tracking-widest bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">{event.current_stage || 'N/A'}</span>
                </td>
                <td className="px-4 py-4 text-center">
                    {event.is_active ? (
                        <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest italic bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">Active</span>
                    ) : (
                        <span className="text-white/20 text-[10px] font-black uppercase tracking-widest italic bg-white/5 px-3 py-1 rounded-full border border-white/10">Standby</span>
                    )}
                </td>
                <td className="px-4 py-4 text-right">
                    <button
                        className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 ${event.is_active ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20" : "bg-emerald-500 text-white shadow-lg hover:bg-emerald-400"}`}
                        onClick={() => handleToggleActive(event.id, !event.is_active)}
                    >
                        {event.is_active ? "Terminate Entry" : "Open Registration"}
                    </button>
                </td>
                </tr>
            ))}
            {events.length === 0 && !loading && (
                <tr>
                    <td colSpan={4} className="py-10 text-center text-white/20 text-xs font-black uppercase tracking-widest">No Events Logged</td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
