import React, { useEffect, useState } from "react";

interface Fixture {
  id: number;
  round: number;
  player1_id: number;
  player2_id: number;
  scheduled_at: string | null;
  result_submitted: boolean;
}

interface Props {
  leagueId: number;
}

export default function AdminLeagueFixtures({ leagueId }: Props) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchFixtures() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/league/events/${leagueId}/fixtures`);
      if (!res.ok) throw new Error("Failed to fetch fixtures");
      const data = await res.json();
      setFixtures(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFixtures();
  }, [leagueId]);

  const [generating, setGenerating] = useState(false);

  async function handleGenerateFixtures() {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch(`/api/league/events/${leagueId}/fixtures/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed to generate fixtures");
      await fetchFixtures();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">Fixtures</h3>
      <button
        className="mb-4 bg-amber-400 text-black font-black px-6 py-2 rounded-xl shadow hover:bg-amber-300 transition"
        onClick={handleGenerateFixtures}
        disabled={generating}
      >
        {generating ? "Generating..." : "Generate Fixtures"}
      </button>
      {loading && <div className="text-white/60">Loading fixtures...</div>}
      {error && <div className="text-red-400">{error}</div>}
      <table className="min-w-full bg-[#07111d] rounded-xl shadow-lg mt-4">
        <thead>
          <tr className="text-amber-400 text-xs uppercase">
            <th className="px-4 py-2">Round</th>
            <th className="px-4 py-2">Player 1</th>
            <th className="px-4 py-2">Player 2</th>
            <th className="px-4 py-2">Scheduled</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {fixtures.map((fix) => (
            <tr key={fix.id}>
              <td className="px-4 py-2 text-center">{fix.round}</td>
              <td className="px-4 py-2 text-center">User {fix.player1_id}</td>
              <td className="px-4 py-2 text-center">User {fix.player2_id}</td>
              <td className="px-4 py-2 text-center">{fix.scheduled_at ? new Date(fix.scheduled_at).toLocaleString() : "TBD"}</td>
              <td className="px-4 py-2 text-center font-bold">
                {fix.result_submitted ? <span className="text-green-400">Completed</span> : <span className="text-yellow-400">Pending</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
