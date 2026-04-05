"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { AdminCard, AdminShell, StatusBanner, AdminLoader, adminButtonClasses, adminInputClasses } from "@/components/admin/AdminShell";
import type { StoreSettingsResponse } from "@/types/dashboard";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    storeName: "", logoUrl: "", logoWidthPx: "120", logoHeightPx: "32",
    heroImageUrl: "", authBackgroundUrl: "", authBackgroundColor: "", tagline: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    if (!token || !user) { router.replace("/login"); return; }
    if (user.role !== "admin") { router.replace("/account"); return; }

    setError(null);
    apiRequest<StoreSettingsResponse>("/store-settings", { token })
      .then((data) => {
        setForm({
          storeName: data.settings.storeName, logoUrl: data.settings.logoUrl,
          logoWidthPx: String(data.settings.logoWidthPx || 120), logoHeightPx: String(data.settings.logoHeightPx || 32),
          heroImageUrl: data.settings.heroImageUrl || data.settings.logoUrl,
          authBackgroundUrl: data.settings.authBackgroundUrl || "",
          authBackgroundColor: data.settings.authBackgroundColor || "",
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
    setError(null); setSuccess(null); setSaving(true);
    try {
      await apiRequest<StoreSettingsResponse>("/admin/store-settings", { method: "PUT", token, body: form });
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
      actions={<Link href="/admin" className={adminButtonClasses.ghost}>Back to dashboard</Link>}
    >
      {error && <StatusBanner tone="error" title="Settings error" description={error} />}
      {success && <StatusBanner tone="success" title="Settings updated" description={success} />}

      <AdminCard>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {loading ? <AdminLoader /> : (
            <>
              <div className="adm-form-group"><label className="adm-form-label">Store name</label><input className={adminInputClasses} value={form.storeName} onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))} /></div>
              <div className="adm-form-group"><label className="adm-form-label">Logo image URL</label><input className={adminInputClasses} value={form.logoUrl} onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="adm-form-group"><label className="adm-form-label">Logo width (px, max 600)</label><input className={adminInputClasses} type="number" min={40} max={600} value={form.logoWidthPx} onChange={(e) => setForm((f) => ({ ...f, logoWidthPx: e.target.value }))} /></div>
                <div className="adm-form-group"><label className="adm-form-label">Logo height (px, max 200)</label><input className={adminInputClasses} type="number" min={16} max={200} value={form.logoHeightPx} onChange={(e) => setForm((f) => ({ ...f, logoHeightPx: e.target.value }))} /></div>
              </div>
              <div className="adm-form-group"><label className="adm-form-label">Homepage hero image URL</label><input className={adminInputClasses} value={form.heroImageUrl} onChange={(e) => setForm((f) => ({ ...f, heroImageUrl: e.target.value }))} /></div>
              <div className="adm-form-group"><label className="adm-form-label">Auth background image URL (optional)</label><input className={adminInputClasses} value={form.authBackgroundUrl} onChange={(e) => setForm((f) => ({ ...f, authBackgroundUrl: e.target.value }))} /></div>
              <div className="adm-form-group"><label className="adm-form-label">Auth background base color (optional)</label><input className={adminInputClasses} value={form.authBackgroundColor} onChange={(e) => setForm((f) => ({ ...f, authBackgroundColor: e.target.value }))} /></div>
              <div className="adm-form-group"><label className="adm-form-label">Tagline</label><input className={adminInputClasses} value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} /></div>
              <button type="submit" disabled={saving} className={adminButtonClasses.primary}>{saving ? "Saving..." : "Save settings"}</button>
            </>
          )}
        </form>
      </AdminCard>
    </AdminShell>
  );
}
