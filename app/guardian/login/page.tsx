"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldAlert, Lock, RefreshCw, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { loginRushUser, getTurnstileSiteKey, saveRushAuth } from "@/lib/api";

export default function GuardianLoginPage() {
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
        router.replace("/guardian");
      }
    } catch (err: any) {
      setError(err.message || "Authorization failed. Please check credentials.");
      if (turnstileEnabled && window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 relative overflow-hidden font-sans">

      {/* Visual background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[100px] rounded-full -z-10" />

      <div className="w-full max-w-md px-6">
        <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-10 text-sm font-medium"
        >
            <ChevronLeft size={16} />
            Back to Website
        </Link>

        <form
            onSubmit={handleSubmit}
            className="bg-slate-900/50 border border-slate-800 p-10 rounded-[32px] shadow-2xl backdrop-blur-xl flex flex-col items-center"
        >
            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-8">
                <ShieldCheck className="text-blue-500" size={32} />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">Security Access</h2>
            <p className="text-slate-500 mb-8 text-center text-sm font-medium uppercase tracking-widest">
                Guardian Node Authorization
            </p>

            <div className="w-full space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Identity Email</label>
                    <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Access Key</label>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                            required
                        />
                        <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700" />
                    </div>
                </div>
            </div>

            {turnstileEnabled && (
                <div className="mt-6 scale-90">
                    <div ref={widgetRef} />
                </div>
            )}

            {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest text-center w-full">
                    <ShieldAlert className="inline-block mr-2" size={12} />
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-4 rounded-xl bg-blue-600 text-white font-bold uppercase text-xs tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
                {loading ? <RefreshCw size={18} className="animate-spin" /> : "Authorize Link"}
            </button>

            <div className="mt-10 text-[8px] font-black text-slate-700 text-center uppercase tracking-[0.4em]">
                Protocol: Secure_Auth_V2.1
            </div>
        </form>
      </div>
    </div>
  );
}
