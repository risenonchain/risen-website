"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginRushUser, getTurnstileSiteKey, saveRushAuth } from "@/lib/api";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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
        saveRushAuth(data.access_token);
        localStorage.setItem("risen_ai_token", data.access_token);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#010913] text-white relative overflow-hidden font-sans p-6">

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

      {/* 🌌 DYNAMIC BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,219,255,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#2EDBFF_1px,transparent_1px),linear-gradient(90deg,#2EDBFF_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* GLOWING ORBS */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-risen-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-[#030913]/60 p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-white/5 backdrop-blur-3xl flex flex-col items-center"
      >
        <div className="relative mb-8 group">
           <div className="absolute inset-0 rounded-full blur-2xl bg-risen-primary/20 group-hover:bg-risen-primary/40 transition-colors animate-pulse" />
           <div className="relative h-20 w-20 rounded-full border-2 border-white/10 bg-[#020B1A] flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(46,219,255,0.1)]">
              <Image src="/logo.png" alt="RISEN Logo" width={48} height={48} className="z-10" />
              <div className="absolute inset-0 border-[1px] border-dashed border-risen-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
           </div>
        </div>

        <h2 className="text-3xl font-black text-white mb-2 text-center uppercase tracking-tighter italic">Cognitive Portal</h2>
        <div className="text-risen-primary/80 mb-8 text-center text-[10px] uppercase tracking-[0.4em] font-black italic">
          Neural Network Authorization
        </div>

        <div className="w-full space-y-4">
           <div className="relative group">
              <input
                type="email"
                placeholder="IDENTITY_EMAIL"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-[#07111d] border border-white/20 text-white text-xs font-black uppercase tracking-widest outline-none transition-all focus:border-risen-primary/60 focus:bg-[#0a1829] placeholder:text-white/40"
                required
              />
           </div>

           <div className="relative group">
              <input
                type="password"
                placeholder="ACCESS_KEY"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-[#07111d] border border-white/20 text-white text-xs font-black uppercase tracking-widest outline-none transition-all focus:border-risen-primary/60 focus:bg-[#0a1829] placeholder:text-white/40"
                required
              />
           </div>
        </div>

        {turnstileEnabled && (
          <div className="mt-6 mb-2 scale-90 opacity-80 hover:opacity-100 transition-opacity">
            <div ref={widgetRef} />
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full mt-8 py-5 rounded-2xl bg-risen-primary text-black font-black uppercase text-[11px] tracking-[0.3em] shadow-[0_0_40px_rgba(46,219,255,0.2)] hover:shadow-[0_0_60px_rgba(46,219,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 relative overflow-hidden group"
          disabled={loading}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative z-10">{loading ? "Synchronizing..." : "Initialize Session"}</span>
        </button>

        <div className="mt-10 text-[8px] font-black text-white/10 text-center uppercase tracking-[0.6em]">
          Uplink Monitor: Active
        </div>
      </form>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}
