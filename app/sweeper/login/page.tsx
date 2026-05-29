"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Lock, RefreshCw, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { loginRushUser, getTurnstileSiteKey, saveRushAuth } from "@/lib/api";

export default function SweeperLoginPage() {
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
        saveRushAuth(data.access_token);
        router.replace("/sweeper");
      }
    } catch (err: any) {
      setError(err.message || "Authorization failed.");
      if (turnstileEnabled && window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#01070e] text-slate-200 relative overflow-hidden font-sans p-6">

      {/* Back Link */}
      <div className="absolute top-8 left-8 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest italic"
        >
          <ChevronLeft size={16} />
          Back to Terminal
        </Link>
      </div>

      {/* Visual background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-400/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-risen-primary/5 blur-[100px] rounded-full -z-10" />

      <div className="w-full max-w-md">
        <form
            onSubmit={handleSubmit}
            className="bg-slate-900/40 border border-white/5 p-10 rounded-[40px] shadow-2xl backdrop-blur-xl flex flex-col items-center"
        >
            <div className="p-4 bg-amber-400/10 rounded-2xl border border-amber-400/20 mb-8 text-amber-400">
                <Trash2 size={32} />
            </div>

            <h2 className="text-3xl font-black text-white mb-2 text-center tracking-tighter uppercase italic">Optimization Access</h2>
            <p className="text-amber-400 mb-8 text-center text-[10px] font-black uppercase tracking-[0.4em] italic">
                Sweeper Protocol Authorization
            </p>

            <div className="w-full space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-black text-white/20 ml-1 tracking-widest">Protocol Identity</label>
                    <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-black/40 border border-white/5 text-white text-xs font-black outline-none focus:border-amber-400/50 transition-all placeholder:text-white/10 uppercase tracking-widest"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-black text-white/20 ml-1 tracking-widest">Temporal Key</label>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-black/40 border border-white/5 text-white text-xs font-black outline-none focus:border-amber-400/50 transition-all placeholder:text-white/10"
                            required
                        />
                        <Lock size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10" />
                    </div>
                </div>
            </div>

            {turnstileEnabled && (
                <div className="mt-6 scale-90">
                    <div ref={widgetRef} />
                </div>
            )}

            {error && (
                <div className="mt-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest text-center w-full">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-5 rounded-[28px] bg-white text-black font-black uppercase text-[11px] tracking-[0.3em] shadow-lg shadow-white/5 hover:bg-amber-400 hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
                {loading ? <RefreshCw size={18} className="animate-spin" /> : "Authorize Link"}
            </button>

            <div className="mt-10 text-[8px] font-black text-white/10 text-center uppercase tracking-[0.6em] italic">
                Wallet_Cleanup_V1.0_Sync
            </div>
        </form>
      </div>
    </div>
  );
}
