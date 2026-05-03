import React, { useEffect, useState } from "react";

interface TopScore {
  id: number;
  user_id: number;
  score: number;
  match_id: number;
}

type Props = { leagueId: number };
export default function LeagueTopScores({ leagueId }: Props) {
  const [scores, setScores] = useState<TopScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/league/events/${leagueId}/top-scores`);
        if (!res.ok) throw new Error("Failed to fetch top scores");
        const data = await res.json();
        setScores(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchScores();
  }, [leagueId]);

  if (loading) return <div className="text-center text-white/60">Loading top scores...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-[#030913] rounded-xl shadow-lg">
        <thead>
          <tr className="text-amber-400 text-xs uppercase">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Score</th>
            <th className="px-4 py-2">Match</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((row, idx) => (
            <tr key={row.id} className={idx === 0 ? "bg-amber-400/10" : ""}>
              <td className="px-4 py-2 text-center font-bold">{idx + 1}</td>
              <td className="px-4 py-2 text-center">User {row.user_id}</td>
              <td className="px-4 py-2 text-center font-black text-amber-400">{row.score}</td>
              <td className="px-4 py-2 text-center">{row.match_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
