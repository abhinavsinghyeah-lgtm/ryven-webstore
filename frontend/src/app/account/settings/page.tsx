"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import type { AuthUser } from "@/types/auth";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

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
    if (!token) {
      router.replace("/login");
      return;
    }

    const run = async () => {
      try {
        const response = await apiRequest<{ user: AuthUser }>("/auth/me", { token });
        setUser(response.user);
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

    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const token = authStorage.getToken();
    if (!token) return;
    setSaving(true);

    try {
      await apiRequest("/auth/change-password", {
        method: "POST",
        token,
        body: {
          oldPassword: user.isPasswordSet ? form.currentPassword : undefined,
          newPassword: form.newPassword,
        },
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
    return (
      <div className="rounded-3xl border border-black/5 bg-white p-8">
        <Spinner label="Loading settings..." />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
        <h1 className="text-2xl font-semibold text-neutral-900">Account settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your profile details and security.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <h2 className="text-lg font-semibold text-neutral-900">Profile</h2>
          <p className="mt-1 text-sm text-neutral-500">Saved details for your Ryven account.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoRow label="Full name" value={user?.fullName || "-"} />
            <InfoRow label="Email" value={user?.email || "-"} />
            <InfoRow label="Phone" value={user?.phone || "Not provided"} />
            <InfoRow label="Verification" value={user?.isVerified ? "Verified" : "Pending"} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <h2 className="text-lg font-semibold text-neutral-900">Security</h2>
          <p className="mt-1 text-sm text-neutral-500">
            {user?.isPasswordSet ? "Change your password with your current password." : "Set a password for your account."}
          </p>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {user?.isPasswordSet ? (
              <Field
                label="Current password"
                type="password"
                value={form.currentPassword}
                onChange={(value) => setForm((prev) => ({ ...prev, currentPassword: value }))}
                placeholder="Enter current password"
              />
            ) : null}
            <Field
              label="New password"
              type="password"
              value={form.newPassword}
              onChange={(value) => setForm((prev) => ({ ...prev, newPassword: value }))}
              placeholder="Minimum 8 characters"
            />
            <Field
              label="Confirm new password"
              type="password"
              value={form.confirmPassword}
              onChange={(value) => setForm((prev) => ({ ...prev, confirmPassword: value }))}
              placeholder="Repeat password"
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : user?.isPasswordSet ? "Update password" : "Set password"}
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2 text-sm text-neutral-600">
      <span className="text-sm font-medium text-neutral-800">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-900 outline-none focus:border-neutral-400"
        required
      />
    </label>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{label}</p>
      <p className="mt-2 text-base font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-sm text-neutral-500">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      {label}
    </div>
  );
}
