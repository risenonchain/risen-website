"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  fetchCurrentRushUser,
  getTurnstileSiteKey,
  loginRushUser,
  saveRushAuth,
} from "@/lib/api";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export default function RushLoginPage() {
  const router = useRouter();
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCapacitor, setIsCapacitor] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Capacitor) {
      setIsCapacitor(true);
    }
  }, []);

  const turnstileEnabled = !!getTurnstileSiteKey();

  useEffect(() => {
    if (!turnstileEnabled) return;
    if (!widgetRef.current) return;

    let intervalId: any = null;

    const renderWidget = () => {
      if (!window.turnstile || !widgetRef.current || widgetIdRef.current) return;

      try {
        widgetIdRef.current = window.turnstile.render(widgetRef.current, {
          sitekey: getTurnstileSiteKey(),
          theme: "dark",
          callback: (token: string) => {
            setTurnstileToken(token);
            setError(null);
          },
          "expired-callback": () => {
            setTurnstileToken(null);
            if (window.turnstile && widgetIdRef.current) {
              window.turnstile.reset(widgetIdRef.current);
            }
          },
          "error-callback": () => {
            setTurnstileToken(null);
            setError("Verification error. Resetting...");
            if (window.turnstile && widgetIdRef.current) {
              window.turnstile.reset(widgetIdRef.current);
            }
          },
        });
      } catch (e) {
        console.error("Turnstile render error:", e);
      }
    };

    const scriptId = "cloudflare-turnstile-script";
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      if (window.turnstile) {
        renderWidget();
      } else {
        intervalId = setInterval(() => {
          if (window.turnstile) {
            clearInterval(intervalId);
            renderWidget();
          }
        }, 100);
      }
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      script.onerror = () => {
        setError("Security challenge failed to load. Check your internet connection.");
      };
      document.body.appendChild(script);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch (e) {}
        widgetIdRef.current = null;
      }
    };
  }, [turnstileEnabled]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (turnstileEnabled && !turnstileToken) {
      setError("Please complete the verification challenge.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const loginResult = await loginRushUser(
        { email, password },
        turnstileToken
      );
      saveRushAuth(loginResult.access_token, "");

      const me = await fetchCurrentRushUser();
      saveRushAuth(loginResult.access_token, me.username);

      router.push("/rush");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);

      if (turnstileEnabled && window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#02070d] px-4 py-8 sm:px-6 sm:py-10 text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex min-h-[85vh] max-w-6xl items-center justify-center"
      >
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl md:grid-cols-[0.95fr_1.05fr]">
          <div className="relative hidden md:flex flex-col justify-between border-r border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(46,219,255,0.16),transparent_25%),linear-gradient(180deg,#06111d,#030913)] p-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-risen-primary/25 bg-risen-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-risen-primary">
                <span className="h-2 w-2 rounded-full bg-risen-primary shadow-[0_0_14px_rgba(46,219,255,0.9)]" />
                RISEN Rush
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight">
                Enter the vault.
                <br />
                Catch the rise.
              </h1>

              <p className="mt-5 max-w-md text-white/72 leading-7">
                Sign in to play RISEN Rush, build your score, track your wallet
                points, and climb future leaderboard rankings.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3 text-sm text-white/68"
            >
              <p>• 3 daily trials</p>
              <p>• Level-up every 30 seconds</p>
              <p>• 100,000 points minimum future claim threshold</p>
            </motion.div>
          </div>

          <div className="bg-[#07111d]/95 p-6 sm:p-8 md:p-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto max-w-md"
            >
              <div className="text-sm uppercase tracking-[0.28em] text-white/45">
                Sign in
              </div>

              <h2 className="mt-3 text-3xl font-bold">Welcome back</h2>

              <p className="mt-3 text-white/68">
                Access your RISEN Rush account and continue your run.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/75" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="username"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-risen-primary/50 focus:bg-white/8"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-white/75" htmlFor="password">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-risen-primary/50 focus:bg-white/8"
                    placeholder="Enter your password"
                  />
                </div>

                {turnstileEnabled ? (
                  <div>
                    <div ref={widgetRef} className="min-h-[65px]" />
                  </div>
                ) : null}

                <div className="-mt-1 flex justify-end">
                  <Link
                    href="/rush/forgot-password"
                    className="text-sm font-semibold text-cyan-300 underline underline-offset-4 transition hover:text-white"
                  >
                    Forgot password?
                  </Link>
                </div>

                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    {error}
                  </motion.div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-risen-primary px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(46,219,255,0.35)] transition hover:shadow-[0_0_38px_rgba(46,219,255,0.45)] disabled:opacity-60 active:scale-[0.98]"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-sm text-white/60 text-center">
                New to RISEN Rush?{" "}
                <Link
                  href="/rush/register"
                  className="font-semibold text-risen-primary hover:text-white"
                >
                  Create account
                </Link>
              </p>

              {!isCapacitor && (
                <p className="mt-4 text-sm text-white/50 text-center">
                  <Link href="/" className="hover:text-white">
                    ← Back to RISEN homepage
                  </Link>
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
