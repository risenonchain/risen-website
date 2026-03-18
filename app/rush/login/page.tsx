"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  fetchCurrentRushUser,
  loginRushUser,
  saveRushAuth,
} from "@/lib/api";

export default function RushLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const loginResult = await loginRushUser({ email, password });
      saveRushAuth(loginResult.access_token, "");

      const me = await fetchCurrentRushUser();
      saveRushAuth(loginResult.access_token, me.username);

      router.push("/rush");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
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
            </div>

            <div className="space-y-3 text-sm text-white/68">
              <p>• 3 daily trials</p>
              <p>• Level-up every 30 seconds</p>
              <p>• 100,000 points minimum future claim threshold</p>
            </div>
          </div>

          <div className="bg-[#07111d]/95 p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="text-sm uppercase tracking-[0.28em] text-white/45">
                Sign in
              </div>

              <h2 className="mt-3 text-3xl font-bold">Welcome back</h2>

              <p className="mt-3 text-white/68">
                Access your RISEN Rush account and continue your run.
              </p>

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
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-risen-primary/50 focus:bg-white/8"
                    placeholder="Enter your password"
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-risen-primary px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(46,219,255,0.35)] transition hover:shadow-[0_0_38px_rgba(46,219,255,0.45)] disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-sm text-white/60">
                New to RISEN Rush?{" "}
                <Link
                  href="/rush/register"
                  className="font-semibold text-risen-primary hover:text-white"
                >
                  Create account
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