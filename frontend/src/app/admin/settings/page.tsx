"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { AdminCard, AdminShell, StatusBanner, adminButtonClasses, adminInputClasses } from "@/components/admin/AdminShell";
import { ContentSkeleton } from "@/components/ui/ContentSkeleton";
import type { StoreSettingsResponse } from "@/types/dashboard";

export default function AdminSettingsPage() {
  const router = useRouter();

  const [form, setForm] = useState({ storeName: "", logoUrl: "", heroImageUrl: "", tagline: "" });
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

    setError(null);
    apiRequest<StoreSettingsResponse>("/store-settings", { token })
      .then((data) => {
        setForm({
          storeName: data.settings.storeName,
          logoUrl: data.settings.logoUrl,
          heroImageUrl: data.settings.heroImageUrl || data.settings.logoUrl,
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
    <AdminShell
      title="Store Settings"
      subtitle="Refine the storefront identity and keep the hero visuals on point."
      actions={
        <Link href="/admin" className={adminButtonClasses.ghost}>
          Back to dashboard
        </Link>
      }
    >
      {error ? <StatusBanner tone="error" title="Settings error" description={error} /> : null}
      {success ? <StatusBanner tone="success" title="Settings updated" description={success} /> : null}

      <AdminCard>
        <form onSubmit={onSubmit} className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <ContentSkeleton key={index} rows={3} showAvatar={false} className="min-h-[112px]" />
              ))}
            </div>
          ) : (
            <>
              <Field label="Store name" value={form.storeName} onChange={(value) => setForm((f) => ({ ...f, storeName: value }))} />
              <Field label="Logo image URL" value={form.logoUrl} onChange={(value) => setForm((f) => ({ ...f, logoUrl: value }))} />
              <Field label="Homepage hero image URL" value={form.heroImageUrl} onChange={(value) => setForm((f) => ({ ...f, heroImageUrl: value }))} />
              <Field label="Tagline" value={form.tagline} onChange={(value) => setForm((f) => ({ ...f, tagline: value }))} />

              <button type="submit" disabled={saving} className={adminButtonClasses.primary}>
                {saving ? "Saving..." : "Save settings"}
              </button>
            </>
          )}
        </form>
      </AdminCard>
    </AdminShell>
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
      <span className="text-sm text-white/70">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={adminInputClasses}
      />
    </label>
  );
}
