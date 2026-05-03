import React, { useEffect, useState } from "react";

interface DeepestRunner {
  id: number;
  user_id: number;
  level_reached: number;
  match_id: number;
}

type Props = { leagueId: number };
export default function LeagueDeepestRunners({ leagueId }: Props) {
  const [runners, setRunners] = useState<DeepestRunner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRunners() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/league/events/${leagueId}/deepest-runners`);
        if (!res.ok) throw new Error("Failed to fetch deepest runners");
        const data = await res.json();
        setRunners(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchRunners();
  }, [leagueId]);

  if (loading) return <div className="text-center text-white/60">Loading deepest runners...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-[#030913] rounded-xl shadow-lg">
        <thead>
          <tr className="text-amber-400 text-xs uppercase">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Level</th>
            <th className="px-4 py-2">Match</th>
          </tr>
        </thead>
        <tbody>
          {runners.map((row, idx) => (
            <tr key={row.id} className={idx === 0 ? "bg-amber-400/10" : ""}>
              <td className="px-4 py-2 text-center font-bold">{idx + 1}</td>
              <td className="px-4 py-2 text-center">User {row.user_id}</td>
              <td className="px-4 py-2 text-center font-black text-amber-400">{row.level_reached}</td>
              <td className="px-4 py-2 text-center">{row.match_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
