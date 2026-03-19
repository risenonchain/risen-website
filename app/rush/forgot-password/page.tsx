"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { requestRushPasswordReset } from "@/lib/api";

export default function RushForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      setResetToken(null);
      setExpiresAt(null);

      const result = await requestRushPasswordReset({ email });

      setSuccessMessage(result.message);
      setResetToken(result.reset_token ?? null);
      setExpiresAt(result.expires_at ?? null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to request password reset";
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
                Recover your access.
                <br />
                Re-enter the vault.
              </h1>

              <p className="mt-5 max-w-md text-white/72 leading-7">
                Enter the email linked to your RISEN Rush account to generate a
                password reset token.
              </p>
            </div>

            <div className="space-y-3 text-sm text-white/68">
              <p>• Reset token expires in about 30 minutes</p>
              <p>• Use the token on the reset password page</p>
              <p>• Keep your account access secure</p>
            </div>
          </div>

          <div className="bg-[#07111d]/95 p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="text-sm uppercase tracking-[0.28em] text-white/45">
                Forgot password
              </div>

              <h2 className="mt-3 text-3xl font-bold">Reset access</h2>

              <p className="mt-3 text-white/68">
                Generate a reset token for your RISEN Rush account.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    Account email
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

                {error ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100">
                    <div className="font-medium text-white">{successMessage}</div>

                    {resetToken ? (
                      <div className="mt-4 space-y-3">
                        <div>
                          <div className="mb-1 text-xs uppercase tracking-[0.2em] text-white/50">
                            Reset token
                          </div>
                          <div className="break-all rounded-xl border border-white/10 bg-black/20 px-3 py-3 font-mono text-xs text-white/90">
                            {resetToken}
                          </div>
                        </div>

                        {expiresAt ? (
                          <div className="text-xs text-white/60">
                            Expires at: {new Date(expiresAt).toLocaleString()}
                          </div>
                        ) : null}

                        <Link
                          href={`/rush/reset-password?token=${encodeURIComponent(
                            resetToken
                          )}`}
                          className="inline-flex items-center justify-center rounded-2xl border border-risen-primary/30 bg-risen-primary/10 px-4 py-3 font-medium text-risen-primary transition hover:bg-risen-primary/15 hover:text-white"
                        >
                          Continue to reset password
                        </Link>
                      </div>
                    ) : (
                      <div className="mt-3 text-white/70">
                        If the account exists, continue with your reset token.
                      </div>
                    )}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-risen-primary px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(46,219,255,0.35)] transition hover:shadow-[0_0_38px_rgba(46,219,255,0.45)] disabled:opacity-60"
                >
                  {isSubmitting ? "Generating token..." : "Generate reset token"}
                </button>
              </form>

              <p className="mt-6 text-sm text-white/60">
                Remembered your password?{" "}
                <Link
                  href="/rush/login"
                  className="font-semibold text-risen-primary hover:text-white"
                >
                  Back to sign in
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