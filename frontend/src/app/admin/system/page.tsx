"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, AdminLoader, adminButtonClasses } from "@/components/admin/AdminShell";
import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import type { AdminSystemOverviewResponse, AdminSystemService } from "@/types/dashboard";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes, index = 0;
  while (value >= 1024 && index < units.length - 1) { value /= 1024; index += 1; }
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86400), h = Math.floor((seconds % 86400) / 3600), m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function AdminSystemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminSystemOverviewResponse | null>(null);

  const loadData = async () => {
    const token = authStorage.getToken();
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const response = await apiRequest<AdminSystemOverviewResponse>("/admin/system", { token });
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load system metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    if (!token || !user) { router.replace("/login"); return; }
    if (user.role !== "admin") { router.replace("/account"); return; }
    loadData();
  }, [router]);

  const resourceCards = useMemo(() => {
    if (!data) return [];
    return [
      { label: "RAM usage", used: formatBytes(data.summary.memory.usedBytes), remaining: formatBytes(data.summary.memory.freeBytes), total: formatBytes(data.summary.memory.totalBytes), percent: data.summary.memory.usedPercent, color: "var(--green)" },
      { label: "CPU load", used: `${data.summary.cpu.usedCoresApprox} cores`, remaining: `${data.summary.cpu.freeCoresApprox} free`, total: `${data.summary.cpu.coreCount} total`, percent: data.summary.cpu.usedPercent, color: "var(--pop)" },
      { label: "Storage", used: formatBytes(data.summary.storage.usedBytes), remaining: formatBytes(data.summary.storage.freeBytes), total: formatBytes(data.summary.storage.totalBytes), percent: data.summary.storage.usedPercent, color: "#d97706" },
    ];
  }, [data]);

  return (
    <AdminShell
      title="System Center"
      subtitle="Live VPS health, PM2 process state, and service analytics."
      actions={
        <>
          <Link href="/admin/control" className={adminButtonClasses.ghost}>Open control</Link>
          <button type="button" onClick={loadData} className={adminButtonClasses.primary}>Refresh system</button>
        </>
      }
    >
      {error && <StatusBanner tone="error" title="System metrics issue" description={error} />}

      {loading || !data ? <AdminLoader /> : (
        <>
          {/* Infrastructure header */}
          <section className="adm-grid">
            <AdminCard>
              <p className="adm-header-eyebrow">Infrastructure</p>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", marginTop: 6 }}>{data.summary.hostname}</h2>
              <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 6 }}>
                {data.summary.platform} · {data.summary.env} · API uptime {formatUptime(data.summary.apiUptimeSeconds)}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 20 }}>
                <InfoCard label="Load avg (1m)" value={String(data.summary.cpu.loadAverage1m)} detail={`${data.summary.cpu.coreCount} cores`} />
                <InfoCard label="Load avg (5m)" value={String(data.summary.cpu.loadAverage5m)} detail={data.summary.cpu.model} />
                <InfoCard label="Mount path" value={data.summary.storage.path} detail={formatBytes(data.summary.storage.totalBytes)} />
              </div>
            </AdminCard>

            <AdminCard>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p className="adm-section-label">Live usage</p>
                <span className={`adm-badge ${data.summary.dbConnected ? "adm-badge-green" : "adm-badge-red"}`}>
                  DB {data.summary.dbConnected ? "Connected" : "Down"}
                </span>
              </div>
              <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
                {resourceCards.map((item) => (
                  <div key={item.label} style={{ padding: 16, border: "1px solid var(--border-light)", borderRadius: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{item.label}</p>
                        <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{item.used} used · {item.remaining} left</p>
                      </div>
                      <p style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>{item.percent}%</p>
                    </div>
                    <div style={{ marginTop: 10, height: 6, borderRadius: 100, background: "var(--border-light)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 100, background: item.color, width: `${Math.min(100, item.percent)}%`, transition: "width .4s" }} />
                    </div>
                    <p style={{ fontSize: 11, color: "var(--text-4)", marginTop: 6, letterSpacing: ".12em" }}>TOTAL {item.total}</p>
                  </div>
                ))}
              </div>
            </AdminCard>
          </section>

          {/* Resource stats */}
          <section className="adm-stats" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            <div className="adm-stat">
              <p className="adm-stat-label">RAM left</p>
              <p className="adm-stat-value" style={{ fontSize: 24 }}>{formatBytes(data.summary.memory.freeBytes)}</p>
              <p className="adm-stat-sub">{data.summary.memory.usedPercent}% in use</p>
            </div>
            <div className="adm-stat">
              <p className="adm-stat-label">CPU left</p>
              <p className="adm-stat-value" style={{ fontSize: 24 }}>{data.summary.cpu.freeCoresApprox} cores</p>
              <p className="adm-stat-sub">{data.summary.cpu.usedPercent}% in use</p>
            </div>
            <div className="adm-stat">
              <p className="adm-stat-label">Storage left</p>
              <p className="adm-stat-value" style={{ fontSize: 24 }}>{formatBytes(data.summary.storage.freeBytes)}</p>
              <p className="adm-stat-sub">{data.summary.storage.usedPercent}% in use</p>
            </div>
          </section>

          {/* Services table + Breakdown */}
          <section className="adm-grid">
            <AdminCard>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <p className="adm-section-label">Active services</p>
                <span className="adm-badge adm-badge-gray">{data.services.length} services</span>
              </div>
              <div className="adm-table-wrap" style={{ marginTop: 16 }}>
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Kind</th>
                      <th>Status</th>
                      <th>CPU</th>
                      <th>Memory</th>
                      <th>Uptime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.services.map((service) => (
                      <tr key={`${service.kind}-${service.name}`}>
                        <td style={{ fontWeight: 600 }}>{service.name}</td>
                        <td style={{ textTransform: "uppercase", color: "var(--text-3)", fontSize: 11, letterSpacing: ".1em" }}>{service.kind}</td>
                        <td>
                          <span className={`adm-badge ${statusBadge(service.status)}`}>{service.status}</span>
                        </td>
                        <td>{service.cpuPercent !== null ? `${service.cpuPercent}%` : "—"}</td>
                        <td>{service.memoryBytes !== null ? formatBytes(service.memoryBytes) : "—"}</td>
                        <td>{service.uptimeSeconds !== null ? formatUptime(service.uptimeSeconds) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AdminCard>

            <AdminCard>
              <p className="adm-section-label">Resource breakdown</p>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                <BreakdownCard title="Memory pool" value={formatBytes(data.summary.memory.totalBytes)} rows={[
                  { label: "Used", value: formatBytes(data.summary.memory.usedBytes) },
                  { label: "Free", value: formatBytes(data.summary.memory.freeBytes) },
                  { label: "Usage", value: `${data.summary.memory.usedPercent}%` },
                ]} />
                <BreakdownCard title="CPU budget" value={`${data.summary.cpu.coreCount} cores`} rows={[
                  { label: "Used", value: `${data.summary.cpu.usedCoresApprox} cores` },
                  { label: "Free", value: `${data.summary.cpu.freeCoresApprox} cores` },
                  { label: "1m load", value: String(data.summary.cpu.loadAverage1m) },
                ]} />
                <BreakdownCard title="Storage pool" value={formatBytes(data.summary.storage.totalBytes)} rows={[
                  { label: "Used", value: formatBytes(data.summary.storage.usedBytes) },
                  { label: "Free", value: formatBytes(data.summary.storage.freeBytes) },
                  { label: "Path", value: data.summary.storage.path },
                ]} />
              </div>
            </AdminCard>
          </section>
        </>
      )}
    </AdminShell>
  );
}

function statusBadge(status: string) {
  const v = status.toLowerCase();
  if (["online", "active", "ok"].includes(v)) return "adm-badge-green";
  if (["stopped", "inactive", "errored", "down"].includes(v)) return "adm-badge-red";
  return "adm-badge-amber";
}

function InfoCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div style={{ padding: 14, border: "1px solid var(--border-light)", borderRadius: 10, background: "var(--bg)" }}>
      <p style={{ fontSize: 10, letterSpacing: ".18em", color: "var(--text-4)", textTransform: "uppercase" }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginTop: 6 }}>{value}</p>
      <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>{detail}</p>
    </div>
  );
}

function BreakdownCard({ title, value, rows }: { title: string; value: string; rows: { label: string; value: string }[] }) {
  return (
    <div style={{ padding: 16, border: "1px solid var(--border-light)", borderRadius: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{title}</p>
        <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{value}</p>
      </div>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map((row) => (
          <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--text-3)" }}>{row.label}</span>
            <span style={{ fontWeight: 600, color: "var(--text)" }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
