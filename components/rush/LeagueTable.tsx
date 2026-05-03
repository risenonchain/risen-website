import React, { useEffect, useState } from "react";

interface Standing {
  id: number;
  user_id: number;
  matches_played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  goals_for: number;
  goals_against: number;
}

type Props = { leagueId: number };
export default function LeagueTable({ leagueId }: Props) {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStandings() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/league/events/${leagueId}/standings`);
        if (!res.ok) throw new Error("Failed to fetch standings");
        const data = await res.json();
        setStandings(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchStandings();
  }, [leagueId]);

  if (loading) return <div className="text-center text-white/60">Loading standings...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-[#030913] rounded-xl shadow-lg">
        <thead>
          <tr className="text-amber-400 text-xs uppercase">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">MP</th>
            <th className="px-4 py-2">W</th>
            <th className="px-4 py-2">D</th>
            <th className="px-4 py-2">L</th>
            <th className="px-4 py-2">GF</th>
            <th className="px-4 py-2">GA</th>
            <th className="px-4 py-2">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, idx) => (
            <tr key={row.id} className={idx < 3 ? "bg-amber-400/10" : ""}>
              <td className="px-4 py-2 text-center font-bold">{idx + 1}</td>
              <td className="px-4 py-2 text-center">User {row.user_id}</td>
              <td className="px-4 py-2 text-center">{row.matches_played}</td>
              <td className="px-4 py-2 text-center">{row.wins}</td>
              <td className="px-4 py-2 text-center">{row.draws}</td>
              <td className="px-4 py-2 text-center">{row.losses}</td>
              <td className="px-4 py-2 text-center">{row.goals_for}</td>
              <td className="px-4 py-2 text-center">{row.goals_against}</td>
              <td className="px-4 py-2 text-center font-black text-amber-400">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
