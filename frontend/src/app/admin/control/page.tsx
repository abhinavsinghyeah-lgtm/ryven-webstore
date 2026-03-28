"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, adminButtonClasses } from "@/components/admin/AdminShell";
import { authStorage } from "@/lib/auth";

export default function AdminControlPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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
      title="Control Center"
      subtitle="Monitor system health, review errors, and prepare operational actions."
      actions={
        <button type="button" className={adminButtonClasses.soft}>
          Refresh status
        </button>
      }
    >
      {error ? <StatusBanner tone="error" title="Control error" description={error} /> : null}

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          { title: "Frontend", status: "Online", detail: "Next.js app healthy" },
          { title: "Backend API", status: "Online", detail: "API responding in <200ms" },
          { title: "Database", status: "Online", detail: "Primary database connected" },
        ].map((item) => (
          <AdminCard key={item.title}>
            <p className="text-xs uppercase tracking-[0.24em] text-white/50">{item.title}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{item.status}</p>
            <p className="mt-2 text-sm text-white/60">{item.detail}</p>
          </AdminCard>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <AdminCard>
          <p className="text-sm font-semibold text-white">Service actions</p>
          <p className="mt-2 text-sm text-white/60">
            Phase 2 will wire these buttons to secure admin-only backend actions.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["Restart frontend", "Restart backend", "Reload nginx", "Flush cache"].map((label) => (
              <button key={label} type="button" className={`${adminButtonClasses.ghost} justify-center`} disabled>
                {label}
              </button>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <p className="text-sm font-semibold text-white">Errors & warnings</p>
          <div className="mt-4 space-y-3">
            <EmptyRow message="No warnings captured yet. Logs will appear here." />
          </div>
        </AdminCard>
      </section>

      <AdminCard>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Activity log</p>
          <span className="text-xs uppercase tracking-[0.24em] text-white/50">Last 60 days</span>
        </div>
        <div className="mt-4 space-y-3">
          <LogRow title="System initialized" detail="Admin control center ready." />
          <LogRow title="Deploy checklist" detail="Awaiting next deployment tasks." />
          <LogRow title="Monitoring" detail="Live monitoring will stream here in phase 2." />
        </div>
      </AdminCard>
    </AdminShell>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/60">
      {message}
    </div>
  );
}

function LogRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-white/60">{detail}</p>
    </div>
  );
}
