"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, AdminLoader, adminButtonClasses, adminInputClasses } from "@/components/admin/AdminShell";
import { authStorage } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import type { AdminControlStatusResponse, ControlErrorLogsResponse, EngagementLogsResponse } from "@/types/dashboard";

export default function AdminControlPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AdminControlStatusResponse | null>(null);
  const [errorLogs, setErrorLogs] = useState<ControlErrorLogsResponse | null>(null);
  const [activityLogs, setActivityLogs] = useState<EngagementLogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [secret, setSecret] = useState("");
  const [errorPage, setErrorPage] = useState(0);
  const [activityPage, setActivityPage] = useState(0);

  const fetchData = async (ep = 0, ap = 0) => {
    const token = authStorage.getToken();
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const [s, e, a] = await Promise.all([
        apiRequest<AdminControlStatusResponse>("/admin/control/status", { token }),
        apiRequest<ControlErrorLogsResponse>(`/admin/control/errors?limit=5&offset=${ep * 5}`, { token }),
        apiRequest<EngagementLogsResponse>(`/admin/control/activity?limit=5&offset=${ap * 5}`, { token }),
      ]);
      setStatus(s); setErrorLogs(e); setActivityLogs(a); setErrorPage(ep); setActivityPage(ap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load control data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    if (!token || !user) { router.replace("/login"); return; }
    if (user.role !== "admin") { router.replace("/account"); return; }
    void fetchData(0, 0);
  }, [router]);

  const runAction = async (action: string) => {
    const token = authStorage.getToken();
    if (!token) return;
    setActionMessage(null); setError(null);
    try {
      const response = await apiRequest<{ status: string; output?: string }>("/admin/control/action", { method: "POST", token, body: { action, secret: secret.trim() || undefined } });
      setActionMessage(response.output || "Action executed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  };

  const uptime = status?.data?.apiUptimeSeconds ?? 0;
  const uptimeText = `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`;

  return (
    <AdminShell
      title="Control Center"
      subtitle="Monitor system health, review issues, and manage secure service actions."
      actions={<button type="button" className={adminButtonClasses.soft} onClick={() => fetchData(errorPage, activityPage)}>Refresh status</button>}
    >
      {error && <StatusBanner tone="error" title="Control error" description={error} />}
      {actionMessage && <StatusBanner tone="success" title="Action complete" description={actionMessage} />}

      {loading ? <AdminLoader /> : (
        <>
          {/* Health status */}
          <section className="adm-stats" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            {[
              { title: "Frontend", stat: "Online", detail: "Next.js app healthy" },
              { title: "Backend API", stat: "Online", detail: `Uptime ${uptimeText}` },
              { title: "Database", stat: status?.data?.dbConnected ? "Online" : "Offline", detail: "Primary database" },
            ].map((item) => (
              <div key={item.title} className="adm-stat">
                <p className="adm-stat-label">{item.title}</p>
                <p className="adm-stat-value" style={{ fontSize: 22 }}>{item.stat}</p>
                <p className="adm-stat-sub">{item.detail}</p>
              </div>
            ))}
          </section>

          <section className="adm-grid">
            {/* Service actions */}
            <AdminCard>
              <p className="adm-section-label">Service actions</p>
              <p className="adm-section-sub" style={{ marginTop: 4 }}>
                {status?.data?.controlActionsEnabled ? "Enter the control secret to run a secured action." : "Control actions are disabled. Set CONTROL_ACTIONS_SECRET to enable."}
              </p>
              <form style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }} onSubmit={(e) => { e.preventDefault(); runAction("restart-frontend"); }}>
                <input className={adminInputClasses} value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Control secret" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button type="submit" className={adminButtonClasses.ghost} disabled={!status?.data?.controlActionsEnabled}>Restart frontend</button>
                  <button type="button" className={adminButtonClasses.ghost} disabled={!status?.data?.controlActionsEnabled} onClick={() => runAction("restart-backend")}>Restart backend</button>
                  <button type="button" className={adminButtonClasses.ghost} disabled={!status?.data?.controlActionsEnabled} onClick={() => runAction("reload-nginx")}>Reload nginx</button>
                </div>
              </form>
            </AdminCard>

            {/* Error logs */}
            <AdminCard>
              <p className="adm-section-label">Errors &amp; warnings</p>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {errorLogs?.logs?.length ? errorLogs.logs.map((log) => (
                  <div key={log.id} style={{ padding: 14, border: "1px solid var(--border-light)", borderRadius: 12 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{log.method} {log.path}</p>
                    <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>{log.status} · {log.email || "Guest"} · {new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                )) : (
                  <p style={{ fontSize: 13, color: "var(--text-3)", padding: 16, border: "1px solid var(--border-light)", borderRadius: 12 }}>No errors captured yet.</p>
                )}
              </div>
              <div style={{ marginTop: 12 }}>
                <Pagination total={errorLogs?.pagination?.total ?? 0} current={errorPage} pageSize={5} onChange={async (p) => {
                  const token = authStorage.getToken();
                  if (!token) return;
                  const data = await apiRequest<ControlErrorLogsResponse>(`/admin/control/errors?limit=5&offset=${p * 5}`, { token });
                  setErrorLogs(data); setErrorPage(p);
                }} />
              </div>
            </AdminCard>
          </section>

          {/* Activity log */}
          <AdminCard>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <p className="adm-section-label">Activity log</p>
              <span className="adm-badge adm-badge-gray">Latest traffic events</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {activityLogs?.logs?.length ? activityLogs.logs.map((log) => (
                <div key={`activity-${log.id}`} style={{ padding: 14, border: "1px solid var(--border-light)", borderRadius: 12 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{log.method} {log.path}</p>
                  <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>{log.status} · {log.email || "Guest"} · {log.ip || "—"} · {new Date(log.createdAt).toLocaleString()}</p>
                </div>
              )) : (
                <p style={{ fontSize: 13, color: "var(--text-3)", padding: 16, border: "1px solid var(--border-light)", borderRadius: 12 }}>No recent activity yet.</p>
              )}
            </div>
            <div style={{ marginTop: 12 }}>
              <Pagination total={activityLogs?.pagination?.total ?? 0} current={activityPage} pageSize={5} onChange={async (p) => {
                const token = authStorage.getToken();
                if (!token) return;
                const data = await apiRequest<EngagementLogsResponse>(`/admin/control/activity?limit=5&offset=${p * 5}`, { token });
                setActivityLogs(data); setActivityPage(p);
              }} />
            </div>
          </AdminCard>
        </>
      )}
    </AdminShell>
  );
}

function Pagination({ total, current, pageSize, onChange }: { total: number; current: number; pageSize: number; onChange: (page: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i);
  return (
    <div className="adm-pagination" style={{ justifyContent: "flex-start" }}>
      {pages.map((page) => (
        <button key={page} type="button" className={`adm-page-btn${page === current ? " active" : ""}`} onClick={() => onChange(page)}>{page + 1}</button>
      ))}
    </div>
  );
}
