"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import type { AuthUser } from "@/types/auth";

type PasswordForm = { currentPassword: string; newPassword: string; confirmPassword: string };

export default function AccountSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [form, setForm] = useState<PasswordForm>({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) { router.replace("/login"); return; }

    const run = async () => {
      try {
        const res = await apiRequest<{ user: AuthUser }>("/auth/me", { token });
        setUser(res.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load settings");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setError(null);
    setSuccess(null);

    if (form.newPassword.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (form.newPassword !== form.confirmPassword) { setError("Passwords do not match."); return; }

    const token = authStorage.getToken();
    if (!token) return;
    setSaving(true);

    try {
      await apiRequest("/auth/change-password", {
        method: "POST",
        token,
        body: { oldPassword: user.isPasswordSet ? form.currentPassword : undefined, newPassword: form.newPassword },
      });
      setSuccess("Password updated successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update password.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="acct-card"><div className="acct-spinner-wrap"><span className="acct-spinner" /><span className="acct-spinner-label">Loading settings...</span></div></div>;
  }

  if (error && !user) {
    return <div className="acct-alert acct-alert-error">{error}</div>;
  }

  return (
    <div>
      <div className="acct-card" style={{ marginTop: 0 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>Account settings</h2>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>Manage your profile details and security.</p>
      </div>

      <div className="acct-settings-grid">
        <section className="acct-card">
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Profile</h2>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>Saved details for your Ryven account.</p>
          <div className="acct-info-grid">
            <InfoRow label="Full name" value={user?.fullName || "-"} />
            <InfoRow label="Email" value={user?.email || "-"} />
            <InfoRow label="Phone" value={user?.phone || "Not provided"} />
            <InfoRow label="Verification" value={user?.isVerified ? "Verified" : "Pending"} />
          </div>
        </section>

        <section className="acct-card">
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Security</h2>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>
            {user?.isPasswordSet ? "Change your password with your current password." : "Set a password for your account."}
          </p>

          {error ? <div className="acct-alert acct-alert-error">{error}</div> : null}
          {success ? <div className="acct-alert acct-alert-success">{success}</div> : null}

          <form className="acct-form" onSubmit={handleSubmit}>
            {user?.isPasswordSet ? (
              <div className="acct-form-field">
                <label>Current password</label>
                <input type="password" value={form.currentPassword} onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))} placeholder="Enter current password" required />
              </div>
            ) : null}
            <div className="acct-form-field">
              <label>New password</label>
              <input type="password" value={form.newPassword} onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))} placeholder="Minimum 8 characters" required />
            </div>
            <div className="acct-form-field">
              <label>Confirm new password</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} placeholder="Repeat password" required />
            </div>
            <button type="submit" className="acct-form-submit" disabled={saving}>
              {saving ? "Saving..." : user?.isPasswordSet ? "Update password" : "Set password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="acct-info-item">
      <label>{label}</label>
      <p>{value}</p>
    </div>
  );
}
