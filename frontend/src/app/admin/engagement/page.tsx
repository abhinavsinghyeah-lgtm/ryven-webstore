"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, AdminLoader, adminButtonClasses } from "@/components/admin/AdminShell";
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
    if (!token || !user) { router.replace("/login"); return; }
    if (user.role !== "admin") { router.replace("/account"); return; }

    setLoading(true); setError(null);
    Promise.all([
      apiRequest<EngagementOverviewResponse>("/admin/engagement/overview", { token }),
      apiRequest<EngagementSessionsResponse>("/admin/engagement/sessions?limit=6&offset=0", { token }),
      apiRequest<EngagementLogsResponse>("/admin/engagement/logs?limit=6&offset=0", { token }),
      apiRequest<AbandonedCartsResponse>("/admin/engagement/abandoned?limit=6&offset=0", { token }),
    ])
      .then(([o, s, l, a]) => { setOverview(o); setSessions(s); setLogs(l); setAbandoned(a); })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load engagement data"))
      .finally(() => setLoading(false));
  }, [router]);

  const summary = overview?.summary;
  const topPages = overview?.topPages ?? [];

  const averageTime = useMemo(() => {
    if (!summary) return "0m 00s";
    const totalSeconds = Math.round(summary.avgSessionMinutes * 60);
    return `${Math.floor(totalSeconds / 60)}m ${String(totalSeconds % 60).padStart(2, "0")}s`;
  }, [summary]);

  const loadLogsPage = async (page: number) => {
    const token = authStorage.getToken();
    if (!token) return;
    const data = await apiRequest<EngagementLogsResponse>(`/admin/engagement/logs?limit=6&offset=${page * 6}`, { token });
    setLogs(data); setLogPage(page);
  };

  const loadSessionsPage = async (page: number) => {
    const token = authStorage.getToken();
    if (!token) return;
    const data = await apiRequest<EngagementSessionsResponse>(`/admin/engagement/sessions?limit=6&offset=${page * 6}`, { token });
    setSessions(data); setSessionPage(page);
  };

  const downloadLogs = async () => {
    const token = authStorage.getToken();
    if (!token) return;
    const response = await fetch("/api/v1/admin/engagement/logs/export", { headers: { Authorization: `Bearer ${token}` } });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "activity-logs.csv"; link.click();
    URL.revokeObjectURL(url);
  };

  const refresh = async () => {
    const token = authStorage.getToken();
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const [o, s, l, a] = await Promise.all([
        apiRequest<EngagementOverviewResponse>("/admin/engagement/overview", { token }),
        apiRequest<EngagementSessionsResponse>(`/admin/engagement/sessions?limit=6&offset=${sessionPage * 6}`, { token }),
        apiRequest<EngagementLogsResponse>(`/admin/engagement/logs?limit=6&offset=${logPage * 6}`, { token }),
        apiRequest<AbandonedCartsResponse>("/admin/engagement/abandoned?limit=6&offset=0", { token }),
      ]);
      setOverview(o); setSessions(s); setLogs(l); setAbandoned(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to refresh engagement data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell
      title="Engagement Pulse"
      subtitle="Live traffic, visit patterns, and session depth at a glance."
      actions={<button type="button" className={adminButtonClasses.ghost} onClick={refresh}>Refresh data</button>}
    >
      {error && <StatusBanner tone="error" title="Engagement error" description={error} />}

      {loading ? <AdminLoader /> : (
        <>
          {/* Stats row */}
          <section className="adm-stats">
            <div className="adm-stat fade-up">
              <p className="adm-stat-label">Live visitors</p>
              <p className="adm-stat-value"><span className="adm-live-dot" style={{ marginRight: 8 }} />{summary?.liveVisitors ?? 0}</p>
              <p className="adm-stat-sub">Watching now</p>
            </div>
            <div className="adm-stat fade-up" style={{ animationDelay: "80ms" }}>
              <p className="adm-stat-label">Today</p>
              <p className="adm-stat-value">{summary?.todayVisitors ?? 0}</p>
              <p className="adm-stat-sub">Unique visits</p>
            </div>
            <div className="adm-stat fade-up" style={{ animationDelay: "160ms" }}>
              <p className="adm-stat-label">This week</p>
              <p className="adm-stat-value">{summary?.weekVisitors ?? 0}</p>
              <p className="adm-stat-sub">Sessions</p>
            </div>
            <div className="adm-stat fade-up" style={{ animationDelay: "240ms" }}>
              <p className="adm-stat-label">Avg. time</p>
              <p className="adm-stat-value">{averageTime}</p>
              <p className="adm-stat-sub">Per visitor</p>
            </div>
          </section>

          {/* Activity + Top pages */}
          <section className="adm-grid">
            <AdminCard>
              <p className="adm-section-label">Live activity stream</p>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {logs?.logs?.length ? logs.logs.map((entry) => (
                  <div key={entry.id} style={{ padding: 14, border: "1px solid var(--border-light)", borderRadius: 12 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{entry.method} {entry.path} · <span className={`adm-badge ${entry.status >= 400 ? "adm-badge-red" : "adm-badge-green"}`}>{entry.status}</span></p>
                    <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>{entry.email || "Guest"} · {entry.ip || "—"} · {Math.round(entry.durationMs)}ms</p>
                  </div>
                )) : (
                  <p style={{ fontSize: 13, color: "var(--text-3)", padding: 16, border: "1px solid var(--border-light)", borderRadius: 12 }}>No live sessions yet.</p>
                )}
              </div>
              <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <Pagination total={logs?.pagination?.total ?? 0} current={logPage} onChange={loadLogsPage} />
                <button type="button" className={adminButtonClasses.soft} onClick={downloadLogs}>Download logs</button>
              </div>
            </AdminCard>

            <AdminCard>
              <p className="adm-section-label">Top pages</p>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                {topPages.length ? topPages.map((page) => (
                  <div key={page.path} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--border-light)", borderRadius: 10 }}>
                    <span style={{ fontSize: 13, color: "var(--text-2)" }}>{page.path}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{page.hits}</span>
                  </div>
                )) : (
                  <p style={{ fontSize: 13, color: "var(--text-3)" }}>No top pages yet.</p>
                )}
              </div>
            </AdminCard>
          </section>

          {/* Sessions */}
          <AdminCard>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <p className="adm-section-label">Session log</p>
              <span className="adm-badge adm-badge-gray">{sessions?.pagination?.total ?? 0} sessions</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {sessions?.sessions?.length ? sessions.sessions.map((s) => (
                <div key={s.sessionId} style={{ padding: 14, border: "1px solid var(--border-light)", borderRadius: 12 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{s.email || "Guest"} · {s.ip || "—"}</p>
                  <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>Events: {s.eventCount} · Last seen {new Date(s.lastSeen).toLocaleString()}</p>
                </div>
              )) : (
                <p style={{ fontSize: 13, color: "var(--text-3)", padding: 16 }}>Session logs will appear here once tracking is active.</p>
              )}
            </div>
            <div style={{ marginTop: 14 }}>
              <Pagination total={sessions?.pagination?.total ?? 0} current={sessionPage} onChange={loadSessionsPage} />
            </div>
          </AdminCard>

          {/* Abandoned carts */}
          <AdminCard>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <p className="adm-section-label">Abandoned carts (30 days)</p>
              <span className="adm-badge adm-badge-gray">{abandoned?.pagination?.total ?? 0} carts</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {abandoned?.carts?.length ? abandoned.carts.map((cart) => (
                <div key={`${cart.userId}-${cart.updatedAt}`} style={{ padding: 14, border: "1px solid var(--border-light)", borderRadius: 12 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{cart.email || "Guest"} · {cart.itemCount} items</p>
                  <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>Last update {new Date(cart.updatedAt).toLocaleString()} · {cart.phone || "No phone"}</p>
                </div>
              )) : (
                <p style={{ fontSize: 13, color: "var(--text-3)", padding: 16 }}>No abandoned carts recorded yet.</p>
              )}
            </div>
          </AdminCard>
        </>
      )}
    </AdminShell>
  );
}

function Pagination({ total, current, onChange }: { total: number; current: number; onChange: (page: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / 6));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i);
  return (
    <div className="adm-pagination" style={{ justifyContent: "flex-start" }}>
      {pages.map((page) => (
        <button key={page} type="button" className={`adm-page-btn${page === current ? " active" : ""}`} onClick={() => onChange(page)}>{page + 1}</button>
      ))}
    </div>
  );
}
