"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginRushUser, getTurnstileSiteKey } from "@/lib/api";

export default function AILoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const router = useRouter();
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const turnstileEnabled = !!getTurnstileSiteKey();

  useEffect(() => {
    if (!turnstileEnabled) return;
    if (!widgetRef.current) return;

    const renderWidget = () => {
      if (!window.turnstile || !widgetRef.current || widgetIdRef.current) return;
      try {
        widgetIdRef.current = window.turnstile.render(widgetRef.current, {
          sitekey: getTurnstileSiteKey(),
          theme: "dark",
          callback: (token: string) => setTurnstileToken(token),
        });
      } catch (e) {}
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.onload = renderWidget;
      document.body.appendChild(script);
    }
  }, [turnstileEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (turnstileEnabled && !turnstileToken) {
      setError("Please complete security verification");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await loginRushUser({ email, password }, turnstileToken);
      if (data.access_token) {
        localStorage.setItem("risen_ai_token", data.access_token);
        localStorage.setItem("rush_token", data.access_token);
        router.replace("/ai");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
      if (turnstileEnabled && window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-risen-navy to-[#18102a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(46,219,255,0.08),transparent_70%)] pointer-events-none z-0" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#2EDBFF_1px,transparent_1px),linear-gradient(90deg,#2EDBFF_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-[#101828]/90 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-risen-primary/20 backdrop-blur-xl flex flex-col items-center"
      >
        <Image src="/logo.png" alt="RISEN Logo" width={64} height={64} className="mb-4" />
        <h2 className="text-3xl font-extrabold text-white mb-2 text-center tracking-tight drop-shadow">RISEN AI Portal</h2>
        <div className="text-white/80 mb-6 text-center text-base font-medium">
          Secure access to the RISEN AI ecosystem.<br />
          <span className="text-risen-primary text-sm uppercase tracking-widest font-black">Authentication Node</span>
        </div>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-[#0a101a] border border-risen-primary/20 text-white focus:outline-none focus:ring-2 focus:ring-risen-primary/40 transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-[#0a101a] border border-risen-primary/20 text-white focus:outline-none focus:ring-2 focus:ring-risen-primary/40 transition"
          required
        />

        {turnstileEnabled && (
          <div className="mb-4">
            <div ref={widgetRef} />
          </div>
        )}

        {error && <div className="text-red-400 mb-4 text-center font-semibold text-sm">{error}</div>}

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-risen-primary to-cyan-700 text-white font-bold text-lg shadow-lg hover:from-cyan-400 hover:to-cyan-700 transition disabled:opacity-60 active:scale-95"
          disabled={loading}
        >
          {loading ? "AUTHENTICATING..." : "Login"}
        </button>

        <div className="mt-6 text-xs text-white/40 text-center uppercase tracking-widest font-bold">
          All actions are monitored for security.
        </div>
      </form>
    </div>
  );
}
