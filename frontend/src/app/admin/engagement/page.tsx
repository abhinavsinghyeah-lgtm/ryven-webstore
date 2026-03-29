"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, adminButtonClasses } from "@/components/admin/AdminShell";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { authStorage } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import type {
  AbandonedCartsResponse,
  EngagementLogsResponse,
  EngagementOverviewResponse,
  EngagementSessionsResponse,
} from "@/types/dashboard";

export default function AdminEngagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<EngagementOverviewResponse | null>(null);
  const [sessions, setSessions] = useState<EngagementSessionsResponse | null>(null);
  const [logs, setLogs] = useState<EngagementLogsResponse | null>(null);
  const [abandoned, setAbandoned] = useState<AbandonedCartsResponse | null>(null);
  const [logPage, setLogPage] = useState(0);
  const [sessionPage, setSessionPage] = useState(0);

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
      apiRequest<EngagementSessionsResponse>("/admin/engagement/sessions?limit=6&offset=0", { token }),
      apiRequest<EngagementLogsResponse>("/admin/engagement/logs?limit=6&offset=0", { token }),
      apiRequest<AbandonedCartsResponse>("/admin/engagement/abandoned?limit=6&offset=0", { token }),
    ])
      .then(([overviewData, sessionsData, logsData, abandonedData]) => {
        setOverview(overviewData);
        setSessions(sessionsData);
        setLogs(logsData);
        setAbandoned(abandonedData);
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

  const loadLogsPage = async (page: number) => {
    const token = authStorage.getToken();
    if (!token) return;
    const offset = page * 6;
    const data = await apiRequest<EngagementLogsResponse>(`/admin/engagement/logs?limit=6&offset=${offset}`, { token });
    setLogs(data);
    setLogPage(page);
  };

  const loadSessionsPage = async (page: number) => {
    const token = authStorage.getToken();
    if (!token) return;
    const offset = page * 6;
    const data = await apiRequest<EngagementSessionsResponse>(`/admin/engagement/sessions?limit=6&offset=${offset}`, { token });
    setSessions(data);
    setSessionPage(page);
  };

  const downloadLogs = async () => {
    const token = authStorage.getToken();
    if (!token) return;
    const response = await fetch("/api/v1/admin/engagement/logs/export", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "activity-logs.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminShell
      title="Engagement Pulse"
      subtitle="Live traffic, visit patterns, and session depth at a glance."
      actions={
        <button
          type="button"
          className={adminButtonClasses.ghost}
          onClick={async () => {
            const token = authStorage.getToken();
            if (!token) return;
            setLoading(true);
            setError(null);
            try {
              const [overviewData, sessionsData, logsData, abandonedData] = await Promise.all([
                apiRequest<EngagementOverviewResponse>("/admin/engagement/overview", { token }),
                apiRequest<EngagementSessionsResponse>(`/admin/engagement/sessions?limit=6&offset=${sessionPage * 6}`, { token }),
                apiRequest<EngagementLogsResponse>(`/admin/engagement/logs?limit=6&offset=${logPage * 6}`, { token }),
                apiRequest<AbandonedCartsResponse>("/admin/engagement/abandoned?limit=6&offset=0", { token }),
              ]);
              setOverview(overviewData);
              setSessions(sessionsData);
              setLogs(logsData);
              setAbandoned(abandonedData);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Unable to refresh engagement data");
            } finally {
              setLoading(false);
            }
          }}
        >
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
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/60">
                <Pagination
                  total={logs?.pagination?.total ?? 0}
                  current={logPage}
                  onChange={(page) => loadLogsPage(page)}
                />
                <button type="button" className={adminButtonClasses.soft} onClick={downloadLogs}>
                  Download logs
                </button>
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
            <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
              <Pagination
                total={sessions?.pagination?.total ?? 0}
                current={sessionPage}
                onChange={(page) => loadSessionsPage(page)}
              />
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Abandoned carts (30 days)</p>
              <span className="text-xs uppercase tracking-[0.24em] text-white/50">
                {abandoned?.pagination?.total ?? 0} carts
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {abandoned?.carts?.length ? (
                abandoned.carts.map((cart) => (
                  <div key={`${cart.userId}-${cart.updatedAt}`} className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/70">
                    <p className="text-white">
                      {cart.email || "Guest"} · {cart.itemCount} items
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      Last update {new Date(cart.updatedAt).toLocaleString()} · {cart.phone || "No phone"}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyRow message="No abandoned carts recorded yet." />
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

function Pagination({
  total,
  current,
  onChange,
}: {
  total: number;
  current: number;
  onChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / 6));
  const pages = Array.from({ length: Math.min(3, totalPages) }, (_, idx) => idx);

  return (
    <div className="flex items-center gap-2">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={page === current ? adminButtonClasses.soft : adminButtonClasses.ghost}
          onClick={() => onChange(page)}
        >
          {page + 1}
        </button>
      ))}
    </div>
  );
}
