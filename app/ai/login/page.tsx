"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AILoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);
      const res = await fetch(process.env.NEXT_PUBLIC_RUSH_API_URL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const { access_token } = await res.json();
      localStorage.setItem("risen_ai_token", access_token);
      router.replace("/ai");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a101a] to-[#18102a] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(46,219,255,0.08),transparent_70%)] pointer-events-none z-0" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#0ff_1px,transparent_1px),linear-gradient(90deg,#0ff_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-[#101828]/90 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-cyan-400/20 backdrop-blur-xl flex flex-col items-center"
      >
        <Image src="/logo.png" alt="RISEN Logo" width={64} height={64} className="mb-4" />
        <h2 className="text-3xl font-extrabold text-cyan-300 mb-2 text-center tracking-tight drop-shadow">RISEN AI Portal</h2>
        <div className="text-white/80 mb-6 text-center text-base font-medium">
          Secure access to the RISEN AI ecosystem.<br />
          <span className="text-cyan-400">Authenticate to unlock advanced AI features and personalized insights.</span>
        </div>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-[#0a101a] border border-cyan-400/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-[#0a101a] border border-cyan-400/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition"
          required
        />
        {error && <div className="text-red-400 mb-4 text-center font-semibold">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg shadow-lg hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-6 text-xs text-white/40 text-center">
          Need access? Contact your RISEN administrator.<br />
          All actions are monitored for security.
        </div>
      </form>
    </div>
  );
}
