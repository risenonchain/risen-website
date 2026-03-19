"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { resetRushPassword } from "@/lib/api";

export default function RushResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromQuery = searchParams.get("token");
    if (tokenFromQuery) {
      setToken(tokenFromQuery);
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const result = await resetRushPassword({
        token,
        new_password: newPassword,
      });

      setSuccessMessage(result.message);

      setTimeout(() => {
        router.push("/rush/login");
      }, 1600);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to reset password";
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
                Set a new password.
                <br />
                Get back in the game.
              </h1>

              <p className="mt-5 max-w-md text-white/72 leading-7">
                Enter your reset token and choose a new password for your RISEN
                Rush account.
              </p>
            </div>

            <div className="space-y-3 text-sm text-white/68">
              <p>• Use the reset token you generated earlier</p>
              <p>• Choose a strong password you can remember</p>
              <p>• You’ll return to sign in after success</p>
            </div>
          </div>

          <div className="bg-[#07111d]/95 p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="text-sm uppercase tracking-[0.28em] text-white/45">
                Reset password
              </div>

              <h2 className="mt-3 text-3xl font-bold">Create a new password</h2>

              <p className="mt-3 text-white/68">
                Submit your reset token and your new password.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    Reset token
                  </label>
                  <textarea
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    required
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-risen-primary/50 focus:bg-white/8"
                    placeholder="Paste your reset token"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    New password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-risen-primary/50 focus:bg-white/8"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-risen-primary/50 focus:bg-white/8"
                    placeholder="Confirm new password"
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                    {successMessage} Redirecting to login...
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-risen-primary px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(46,219,255,0.35)] transition hover:shadow-[0_0_38px_rgba(46,219,255,0.45)] disabled:opacity-60"
                >
                  {isSubmitting ? "Resetting password..." : "Reset password"}
                </button>
              </form>

              <p className="mt-6 text-sm text-white/60">
                Need a token first?{" "}
                <Link
                  href="/rush/forgot-password"
                  className="font-semibold text-risen-primary hover:text-white"
                >
                  Generate reset token
                </Link>
              </p>

              <p className="mt-4 text-sm text-white/50">
                <Link href="/rush/login" className="hover:text-white">
                  ← Back to sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}