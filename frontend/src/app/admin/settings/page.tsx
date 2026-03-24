"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import type { StoreSettingsResponse } from "@/types/dashboard";

export default function AdminSettingsPage() {
  const router = useRouter();

  const [form, setForm] = useState({ storeName: "", logoUrl: "", tagline: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/account");
      return;
    }

    apiRequest<StoreSettingsResponse>("/store-settings", { token })
      .then((data) => {
        setForm({
          storeName: data.settings.storeName,
          logoUrl: data.settings.logoUrl,
          tagline: data.settings.tagline,
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load settings"))
      .finally(() => setLoading(false));
  }, [router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const token = authStorage.getToken();
    if (!token) return;

    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      await apiRequest<StoreSettingsResponse>("/admin/store-settings", {
        method: "PUT",
        token,
        body: form,
      });

      setSuccess("Store settings updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-10 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">Store Settings</h1>
        </div>
        <Link href="/admin" className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800">
          Back to dashboard
        </Link>
      </header>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p> : null}

      <form onSubmit={onSubmit} className="rounded-2xl border border-neutral-300 bg-white/90 p-5 space-y-4">
        {loading ? (
          <p className="text-sm text-neutral-600">Loading settings...</p>
        ) : (
          <>
            <Field label="Store name" value={form.storeName} onChange={(value) => setForm((f) => ({ ...f, storeName: value }))} />
            <Field label="Logo image URL" value={form.logoUrl} onChange={(value) => setForm((f) => ({ ...f, logoUrl: value }))} />
            <Field label="Tagline" value={form.tagline} onChange={(value) => setForm((f) => ({ ...f, tagline: value }))} />

            <button
              type="submit"
              disabled={saving}
              className="h-11 rounded-xl bg-neutral-900 px-5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save settings"}
            </button>
          </>
        )}
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-neutral-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-900"
      />
    </label>
  );
}
