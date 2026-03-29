"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, adminButtonClasses } from "@/components/admin/AdminShell";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { authStorage } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import type { EngagementLogsResponse, EngagementOverviewResponse, EngagementSessionsResponse } from "@/types/dashboard";

export default function AdminEngagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<EngagementOverviewResponse | null>(null);
  const [sessions, setSessions] = useState<EngagementSessionsResponse | null>(null);
  const [logs, setLogs] = useState<EngagementLogsResponse | null>(null);

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

    setLoading(true);
    setError(null);

    Promise.all([
      apiRequest<EngagementOverviewResponse>("/admin/engagement/overview", { token }),
      apiRequest<EngagementSessionsResponse>("/admin/engagement/sessions?limit=8&offset=0", { token }),
      apiRequest<EngagementLogsResponse>("/admin/engagement/logs?limit=8&offset=0", { token }),
    ])
      .then(([overviewData, sessionsData, logsData]) => {
        setOverview(overviewData);
        setSessions(sessionsData);
        setLogs(logsData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load engagement data"))
      .finally(() => setLoading(false));
  }, [router]);

  const summary = overview?.summary;
  const topPages = overview?.topPages ?? [];

  const averageTime = useMemo(() => {
    if (!summary) return "0m 00s";
    const totalSeconds = Math.round(summary.avgSessionMinutes * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  }, [summary]);

  return (
    <AdminShell
      title="Engagement Pulse"
      subtitle="Live traffic, visit patterns, and session depth at a glance."
      actions={
        <button type="button" className={adminButtonClasses.ghost}>
          Refresh data
        </button>
      }
    >
      {error ? <StatusBanner tone="error" title="Engagement error" description={error} /> : null}

      {loading ? (
        <AdminLoader label="Loading engagement data..." />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Live visitors" value={String(summary?.liveVisitors ?? 0)} detail="Watching now" />
            <MetricCard label="Today" value={String(summary?.todayVisitors ?? 0)} detail="Unique visits" />
            <MetricCard label="This week" value={String(summary?.weekVisitors ?? 0)} detail="Sessions" />
            <MetricCard label="Avg. time" value={averageTime} detail="Per visitor" />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <AdminCard>
              <p className="text-sm font-semibold text-white">Live activity stream</p>
              <div className="mt-4 space-y-3">
                {logs?.logs?.length ? (
                  logs.logs.map((entry) => (
                    <div key={entry.id} className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/70">
                      <p className="text-white">
                        {entry.method} {entry.path} • {entry.status}
                      </p>
                      <p className="mt-1 text-xs text-white/50">
                        {entry.email || "Guest"} · {entry.ip || "Unknown IP"} · {Math.round(entry.durationMs)}ms
                      </p>
                    </div>
                  ))
                ) : (
                  <EmptyRow message="No live sessions yet. Activity will stream here." />
                )}
              </div>
            </AdminCard>

            <AdminCard>
              <p className="text-sm font-semibold text-white">Top pages</p>
              <div className="mt-4 space-y-3">
                {topPages.length ? (
                  topPages.map((page) => <MetricRow key={page.path} label={page.path} value={String(page.hits)} />)
                ) : (
                  <EmptyRow message="No top pages yet." />
                )}
              </div>
            </AdminCard>
          </section>

          <AdminCard>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Session log (live)</p>
              <span className="text-xs uppercase tracking-[0.24em] text-white/50">
                {sessions?.pagination?.total ?? 0} sessions
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {sessions?.sessions?.length ? (
                sessions.sessions.map((session) => (
                  <div key={session.sessionId} className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/70">
                    <p className="text-white">
                      {session.email || "Guest"} · {session.ip || "Unknown IP"}
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      Events: {session.eventCount} · Last seen {new Date(session.lastSeen).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyRow message="Session-level logs will be listed here once tracking is enabled." />
              )}
            </div>
          </AdminCard>
        </>
      )}
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
