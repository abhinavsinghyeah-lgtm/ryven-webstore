"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, adminButtonClasses } from "@/components/admin/AdminShell";
import { authStorage } from "@/lib/auth";

export default function AdminEngagementPage() {
  const router = useRouter();

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
  }, [router]);

  return (
    <AdminShell
      title="Engagement Pulse"
      subtitle="Live traffic, visit patterns, and session depth at a glance."
      actions={
        <button type="button" className={adminButtonClasses.ghost}>
          Export data
        </button>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Live visitors" value="0" detail="Watching now" />
        <MetricCard label="Today" value="0" detail="Unique visits" />
        <MetricCard label="This week" value="0" detail="Sessions" />
        <MetricCard label="Avg. time" value="0m 00s" detail="Per visitor" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminCard>
          <p className="text-sm font-semibold text-white">Live activity stream</p>
          <div className="mt-4 space-y-3">
            <EmptyRow message="No live sessions yet. Activity will stream here." />
          </div>
        </AdminCard>

        <AdminCard>
          <p className="text-sm font-semibold text-white">Top pages</p>
          <div className="mt-4 space-y-3">
            <MetricRow label="Homepage" value="0" />
            <MetricRow label="Products" value="0" />
            <MetricRow label="Cart" value="0" />
          </div>
        </AdminCard>
      </section>

      <AdminCard>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Session log (60 days)</p>
          <span className="text-xs uppercase tracking-[0.24em] text-white/50">Phase 2 feed</span>
        </div>
        <div className="mt-4 space-y-3">
          <EmptyRow message="Session-level logs will be listed here once tracking is enabled." />
        </div>
      </AdminCard>
    </AdminShell>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <AdminCard>
      <p className="text-xs uppercase tracking-[0.22em] text-white/50">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs text-white/50">{detail}</p>
    </AdminCard>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm">
      <span className="text-white/70">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/60">
      {message}
    </div>
  );
}
