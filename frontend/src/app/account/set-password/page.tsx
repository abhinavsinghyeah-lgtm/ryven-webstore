"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div className="set-pw-page"><p style={{ fontSize: 14, color: "var(--text-3)" }}>Loading...</p></div>}>
      <SetPasswordContent />
    </Suspense>
  );
}

function SetPasswordContent() {
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
      <main className="set-pw-page">
        <div style={{ textAlign: "center" }}>
          <p style={{ fontWeight: 600, color: "var(--text)" }}>Invalid or expired activation link.</p>
          <Link href="/login" style={{ fontSize: 14, color: "var(--text-3)", textDecoration: "underline", marginTop: 12, display: "inline-block" }}>Go to Login</Link>
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
      await apiRequest("/auth/set-password", { method: "POST", body: { token, password } });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="set-pw-page">
      <div className="set-pw-wrap">
        <div className="set-pw-logo"><Link href="/">RYVEN</Link></div>
        <div className="set-pw-card">
          {success ? (
            <div className="set-pw-success">
              <div className="set-pw-success-icon">✓</div>
              <h2>Password Set!</h2>
              <p>Redirecting you to login…</p>
            </div>
          ) : (
            <>
              <h1>Activate your account</h1>
              <p>Choose a secure password to get started.</p>

              {apiError ? <div className="acct-alert acct-alert-error">{apiError}</div> : null}

              <form className="acct-form" onSubmit={handleSubmit}>
                <div className="acct-form-field">
                  <label>New password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" required />
                  {errors.password ? <span style={{ fontSize: 12, color: "#b91c1c", marginTop: 4, display: "block" }}>{errors.password}</span> : null}
                </div>
                <div className="acct-form-field">
                  <label>Confirm password</label>
                  <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" required />
                  {errors.confirm ? <span style={{ fontSize: 12, color: "#b91c1c", marginTop: 4, display: "block" }}>{errors.confirm}</span> : null}
                </div>
                <button type="submit" className="acct-form-submit" disabled={loading}>
                  {loading ? "Setting password..." : "Set Password & Activate"}
                </button>
              </form>

              <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-3)", marginTop: 20 }}>
                Already activated? <Link href="/login" style={{ fontWeight: 600, color: "var(--text)", textDecoration: "underline" }}>Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
