import React, { useEffect, useState } from "react";

interface Fixture {
  id: number;
  round: number;
  player1_id: number;
  player2_id: number;
  scheduled_at: string | null;
  result_submitted: boolean;
}

type Props = { leagueId: number };
export default function LeagueFixtures({ leagueId }: Props) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    fetchFixtures();
  }, [leagueId]);

  if (loading) return <div className="text-center text-white/60">Loading fixtures...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-[#030913] rounded-xl shadow-lg">
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
