"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
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
      formData.append("username", username);
      formData.append("password", password);
      const res = await fetch(process.env.NEXT_PUBLIC_RUSH_API_URL + "/admin-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const { access_token } = await res.json();
      localStorage.setItem("risen_admin_token", access_token);
      router.replace("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a101a] to-[#18102a] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,196,46,0.08),transparent_70%)] pointer-events-none z-0" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#ffc82e_1px,transparent_1px),linear-gradient(90deg,#ffc82e_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-[#101828]/90 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-yellow-400/20 backdrop-blur-xl flex flex-col items-center"
      >
        <Image src="/logo.png" alt="RISEN Logo" width={64} height={64} className="mb-4" />
        <h2 className="text-3xl font-extrabold text-yellow-300 mb-2 text-center tracking-tight drop-shadow">Admin Portal</h2>
        <div className="text-white/80 mb-6 text-center text-base font-medium">
          Secure access for RISEN administrators.<br />
          <span className="text-yellow-400">Manage users, redemptions, and platform settings.</span>
        </div>
        <input
          type="text"
          placeholder="Admin username or email"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-[#0a101a] border border-yellow-400/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-[#0a101a] border border-yellow-400/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition"
          required
        />
        {error && <div className="text-red-400 mb-4 text-center font-semibold">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-6 text-xs text-white/40 text-center">
          Admin access only. All actions are logged for security.<br />
          Contact the RISEN team for support.
        </div>
      </form>
    </div>
  );
}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-risen-primary text-white font-semibold hover:bg-cyan-500 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
