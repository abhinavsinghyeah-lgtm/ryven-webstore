"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-[#111] font-semibold">Invalid or expired activation link.</p>
          <Link href="/login" className="text-sm text-[#555] underline underline-offset-2">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (password !== confirm) errs.confirm = "Passwords don't match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    try {
      await apiRequest("/auth/set-password", {
        method: "POST",
        body: { token, password },
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f1f1ee] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="text-xl font-bold tracking-[0.2em] text-[#111] uppercase">
            RYVEN
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-7 space-y-6">
          {success ? (
            <div className="text-center space-y-3 py-4">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto text-2xl">
                ✓
              </div>
              <h2 className="text-lg font-semibold text-[#111]">Password Set!</h2>
              <p className="text-sm text-[#666]">Redirecting you to login…</p>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-bold text-[#111] mb-1">Activate your account</h1>
                <p className="text-sm text-[#666]">Choose a password to secure your RYVEN account.</p>
              </div>

              {apiError && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#333] mb-1.5">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-[#111] placeholder:text-[#bbb] transition-all outline-none focus:ring-2 focus:ring-[#111]/20 ${
                      errors.password ? "border-red-400 ring-1 ring-red-200" : "border-[#ddd]"
                    }`}
                    placeholder="Minimum 8 characters"
                  />
                  {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirm" className="block text-sm font-medium text-[#333] mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-[#111] placeholder:text-[#bbb] transition-all outline-none focus:ring-2 focus:ring-[#111]/20 ${
                      errors.confirm ? "border-red-400 ring-1 ring-red-200" : "border-[#ddd]"
                    }`}
                    placeholder="Repeat password"
                  />
                  {errors.confirm && <p className="mt-1.5 text-xs text-red-500">{errors.confirm}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-[#111] text-white font-semibold rounded-xl hover:bg-[#333] transition-colors text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Setting password…" : "Activate Account →"}
                </button>
              </form>

              <p className="text-center text-xs text-[#aaa]">
                Already have a password?{" "}
                <Link href="/login" className="text-[#555] underline underline-offset-2">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
