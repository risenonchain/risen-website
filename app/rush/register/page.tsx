"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchCurrentRushUser,
  getTurnstileSiteKey,
  loginRushUser,
  registerRushUser,
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

function normalizeUsername(value: string) {
  return value.trim().replace(/\s+/g, "_");
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCodeFromUrl = searchParams.get("ref")?.trim() || "";

  const widgetRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const turnstileEnabled = !!getTurnstileSiteKey();

  const normalizedUsername = useMemo(
    () => normalizeUsername(username),
    [username]
  );

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    if (!turnstileEnabled) return;
    if (!widgetRef.current) return;

    const existingScript = document.querySelector(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    );

    const renderWidget = () => {
      if (!window.turnstile || !widgetRef.current || widgetIdRef.current) return;

      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: getTurnstileSiteKey(),
        theme: "dark",
        callback: (token: string) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(null),
        "error-callback": () => setTurnstileToken(null),
      });
    };

    if (existingScript) {
      const waitForTurnstile = window.setInterval(() => {
        if (window.turnstile) {
          window.clearInterval(waitForTurnstile);
          renderWidget();
        }
      }, 200);

      return () => window.clearInterval(waitForTurnstile);
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = renderWidget;
    document.body.appendChild(script);
  }, [turnstileEnabled]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const finalUsername = normalizeUsername(username);

    if (finalUsername.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      setError("Please complete the verification challenge.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await registerRushUser(
        {
          email: email.trim(),
          username: finalUsername,
          password,
          referral_code: referralCodeFromUrl || undefined,
        },
        turnstileToken
      );

      const loginResult = await loginRushUser(
        {
          email: email.trim(),
          password,
        },
        turnstileToken
      );
      saveRushAuth(loginResult.access_token, finalUsername);

      const me = await fetchCurrentRushUser();
      saveRushAuth(loginResult.access_token, me.username);

      router.push("/rush");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
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
    <main className="min-h-screen bg-[#02070d] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl md:grid-cols-[0.95fr_1.05fr]">
          <div className="relative hidden md:flex flex-col justify-between border-r border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(46,219,255,0.16),transparent_25%),linear-gradient(180deg,#06111d,#030913)] p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-risen-primary/25 bg-risen-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-risen-primary">
                <span className="h-2 w-2 rounded-full bg-risen-primary shadow-[0_0_14px_rgba(46,219,255,0.9)]" />
                Create Account
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight">
                Join the rush.
                <br />
                Start building points.
              </h1>

              <p className="mt-5 max-w-md text-white/72 leading-7">
                Create your RISEN Rush account, secure your profile, and begin
                earning points toward future launch conversion.
              </p>
            </div>

            <div className="space-y-3 text-sm text-white/68">
              <p>• 3 daily trials + vault rewards</p>
              <p>• 100,000 points minimum threshold</p>
              <p>• Referrals unlock extra vault trials</p>
            </div>
          </div>

          <div className="bg-[#07111d]/95 p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="text-sm uppercase tracking-[0.28em] text-white/45">
                Register
              </div>

              <h2 className="mt-3 text-3xl font-bold">Create your account</h2>

              <p className="mt-3 text-white/68">
                Set up your RISEN Rush identity and enter the game.
              </p>

              {referralCodeFromUrl ? (
                <div className="mt-5 rounded-2xl border border-risen-primary/30 bg-risen-primary/10 px-4 py-3 text-sm text-cyan-100">
                  Referral code detected:{" "}
                  <span className="font-semibold text-white">
                    {referralCodeFromUrl}
                  </span>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-risen-primary/50 focus:bg-white/8"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    minLength={3}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-risen-primary/50 focus:bg-white/8"
                    placeholder="Choose a username"
                  />
                  <p className="mt-2 text-xs text-white/50">
                    Spaces will be converted to underscores. Preview:{" "}
                    <span className="font-medium text-risen-primary">
                      {normalizedUsername || "your_username"}
                    </span>
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm font-medium text-white/75">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-xs font-medium text-white/55 transition hover:text-white"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-risen-primary/50 focus:bg-white/8"
                    placeholder="Create a password"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm font-medium text-white/75">
                      Confirm Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="text-xs font-medium text-white/55 transition hover:text-white"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-risen-primary/50 focus:bg-white/8"
                    placeholder="Confirm your password"
                  />
                  {passwordsMismatch ? (
                    <p className="mt-2 text-xs text-red-300">
                      Passwords do not match.
                    </p>
                  ) : passwordsMatch ? (
                    <p className="mt-2 text-xs text-emerald-300">
                      Passwords match.
                    </p>
                  ) : null}
                </div>

                {turnstileEnabled ? (
                  <div>
                    <div ref={widgetRef} className="min-h-[65px]" />
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting || passwordsMismatch}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-risen-primary px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(46,219,255,0.35)] transition hover:shadow-[0_0_38px_rgba(46,219,255,0.45)] disabled:opacity-60"
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-sm text-white/60">
                Already have an account?{" "}
                <Link
                  href="/rush/login"
                  className="font-semibold text-risen-primary hover:text-white"
                >
                  Sign in
                </Link>
              </p>

              <p className="mt-4 text-sm text-white/50">
                <Link href="/" className="hover:text-white">
                  ← Back to RISEN homepage
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RushRegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#02070d] text-white">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/70">
            Loading register page...
          </div>
        </main>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}