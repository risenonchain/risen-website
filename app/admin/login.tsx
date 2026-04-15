"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      // Send credentials as form data to backend
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
    <div className="min-h-screen flex items-center justify-center bg-[#0a101a]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#101828] p-8 rounded-2xl shadow-lg w-full max-w-sm border border-white/10"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-[#0a101a] border border-white/10 text-white focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-[#0a101a] border border-white/10 text-white focus:outline-none"
          required
        />
        {error && <div className="text-red-400 mb-4 text-center">{error}</div>}
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
