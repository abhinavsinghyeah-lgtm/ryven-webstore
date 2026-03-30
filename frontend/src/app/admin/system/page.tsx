"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AdminLoader } from "@/components/admin/AdminLoader";
import { AdminCard, AdminShell, StatusBanner, adminButtonClasses } from "@/components/admin/AdminShell";
import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import type { AdminSystemOverviewResponse, AdminSystemService } from "@/types/dashboard";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function statusTone(status: string) {
  const value = status.toLowerCase();
  if (["online", "active", "ok"].includes(value)) return "bg-emerald-400/15 text-emerald-200 border-emerald-400/25";
  if (["stopped", "inactive", "errored", "down"].includes(value)) return "bg-rose-400/15 text-rose-200 border-rose-400/25";
  return "bg-amber-400/15 text-amber-200 border-amber-400/25";
}

export default function AdminSystemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminSystemOverviewResponse | null>(null);

  const loadData = async () => {
    const token = authStorage.getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
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
    if (!token || !user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "admin") {
      router.replace("/account");
      return;
    }
    loadData();
  }, [router]);

  const resourceCards = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: "RAM usage",
        used: formatBytes(data.summary.memory.usedBytes),
        remaining: formatBytes(data.summary.memory.freeBytes),
        total: formatBytes(data.summary.memory.totalBytes),
        percent: data.summary.memory.usedPercent,
        accent: "from-emerald-400 to-cyan-400",
      },
      {
        label: "CPU load",
        used: `${data.summary.cpu.usedCoresApprox} cores`,
        remaining: `${data.summary.cpu.freeCoresApprox} cores free`,
        total: `${data.summary.cpu.coreCount} total cores`,
        percent: data.summary.cpu.usedPercent,
        accent: "from-sky-400 to-indigo-400",
      },
      {
        label: "Storage",
        used: formatBytes(data.summary.storage.usedBytes),
        remaining: formatBytes(data.summary.storage.freeBytes),
        total: formatBytes(data.summary.storage.totalBytes),
        percent: data.summary.storage.usedPercent,
        accent: "from-amber-400 to-orange-400",
      },
    ];
  }, [data]);

  return (
    <AdminShell
      title="System Center"
      subtitle="Live VPS health, PM2 process state, and service analytics in one clean operations view."
      actions={
        <>
          <Link href="/admin/control" className={adminButtonClasses.ghost}>
            Open control
          </Link>
          <button type="button" onClick={loadData} className={adminButtonClasses.primary}>
            Refresh system
          </button>
        </>
      }
    >
      {error ? <StatusBanner tone="error" title="System metrics issue" description={error} /> : null}

      {loading || !data ? (
        <AdminLoader label="Loading live VPS metrics..." />
      ) : (
        <>
          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <AdminCard className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_36%),linear-gradient(135deg,#161f2b_0%,#111821_60%,#0e141d_100%)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Infrastructure</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{data.summary.hostname}</h2>
                  <p className="mt-2 max-w-2xl text-sm text-white/65">
                    {data.summary.platform} · {data.summary.env} environment · API uptime {formatUptime(data.summary.apiUptimeSeconds)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Database</p>
                  <p className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${data.summary.dbConnected ? "border-emerald-400/25 bg-emerald-400/15 text-emerald-200" : "border-rose-400/25 bg-rose-400/15 text-rose-200"}`}>
                    {data.summary.dbConnected ? "Connected" : "Down"}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <InfraStat label="Load avg (1m)" value={String(data.summary.cpu.loadAverage1m)} detail={`${data.summary.cpu.coreCount} cores`} />
                <InfraStat label="Load avg (5m)" value={String(data.summary.cpu.loadAverage5m)} detail={data.summary.cpu.model} />
                <InfraStat label="Mount path" value={data.summary.storage.path} detail={formatBytes(data.summary.storage.totalBytes)} />
              </div>
            </AdminCard>

            <AdminCard>
              <p className="text-sm font-semibold text-white">Live usage graph</p>
              <p className="mt-1 text-sm text-white/55">Quick visual of how much of the machine is currently occupied.</p>
              <div className="mt-5 space-y-4">
                {resourceCards.map((item) => (
                  <UsageGraph key={item.label} {...item} />
                ))}
              </div>
            </AdminCard>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard label="RAM left" value={formatBytes(data.summary.memory.freeBytes)} detail={`${data.summary.memory.usedPercent}% in use`} />
            <MetricCard label="CPU left" value={`${data.summary.cpu.freeCoresApprox} cores`} detail={`${data.summary.cpu.usedPercent}% in use`} />
            <MetricCard label="Storage left" value={formatBytes(data.summary.storage.freeBytes)} detail={`${data.summary.storage.usedPercent}% in use`} />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <AdminCard>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Active services</p>
                  <p className="mt-1 text-sm text-white/55">Everything currently running across PM2 and core infrastructure.</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/55">
                  {data.services.length} services
                </span>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.24em] text-white/40">
                      <th className="pb-3 pr-4 font-medium">Service</th>
                      <th className="pb-3 pr-4 font-medium">Kind</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 pr-4 font-medium">CPU</th>
                      <th className="pb-3 pr-4 font-medium">Memory</th>
                      <th className="pb-3 pr-0 font-medium">Uptime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.services.map((service) => (
                      <ServiceRow key={`${service.kind}-${service.name}`} service={service} />
                    ))}
                  </tbody>
                </table>
              </div>
            </AdminCard>

            <AdminCard>
              <p className="text-sm font-semibold text-white">Resource breakdown</p>
              <p className="mt-1 text-sm text-white/55">Hosting-style visibility into what is consumed and what is still available.</p>
              <div className="mt-5 space-y-4">
                <BreakdownCard
                  title="Memory pool"
                  value={formatBytes(data.summary.memory.totalBytes)}
                  rows={[
                    { label: "Used", value: formatBytes(data.summary.memory.usedBytes) },
                    { label: "Free", value: formatBytes(data.summary.memory.freeBytes) },
                    { label: "Usage", value: `${data.summary.memory.usedPercent}%` },
                  ]}
                />
                <BreakdownCard
                  title="CPU budget"
                  value={`${data.summary.cpu.coreCount} cores`}
                  rows={[
                    { label: "Approx used", value: `${data.summary.cpu.usedCoresApprox} cores` },
                    { label: "Approx free", value: `${data.summary.cpu.freeCoresApprox} cores` },
                    { label: "1m load", value: String(data.summary.cpu.loadAverage1m) },
                  ]}
                />
                <BreakdownCard
                  title="Storage pool"
                  value={formatBytes(data.summary.storage.totalBytes)}
                  rows={[
                    { label: "Used", value: formatBytes(data.summary.storage.usedBytes) },
                    { label: "Free", value: formatBytes(data.summary.storage.freeBytes) },
                    { label: "Path", value: data.summary.storage.path },
                  ]}
                />
              </div>
            </AdminCard>
          </section>
        </>
      )}
    </AdminShell>
  );
}

function InfraStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-black/15 p-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-white/55">{detail}</p>
    </div>
  );
}

function UsageGraph({
  label,
  used,
  remaining,
  total,
  percent,
  accent,
}: {
  label: string;
  used: string;
  remaining: string;
  total: string;
  percent: number;
  accent: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/6 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="mt-1 text-sm text-white/55">
            {used} used · {remaining} left
          </p>
        </div>
        <p className="text-2xl font-semibold text-white">{percent}%</p>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/8">
        <div className={`h-full rounded-full bg-gradient-to-r ${accent}`} style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/35">Total pool {total}</p>
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="rounded-[20px] border border-white/5 bg-[#151c26] p-5 shadow-[0_14px_30px_rgba(6,10,16,0.35)]">
      <p className="text-xs uppercase tracking-[0.24em] text-white/40">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-white/55">{detail}</p>
    </article>
  );
}

function BreakdownCard({
  title,
  value,
  rows,
}: {
  title: string;
  value: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="rounded-[20px] border border-white/6 bg-white/[0.03] p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-white/55">{row.label}</span>
            <span className="font-medium text-white">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceRow({ service }: { service: AdminSystemService }) {
  return (
    <tr className="border-b border-white/5 text-white/70">
      <td className="py-4 pr-4">
        <span className="font-semibold text-white">{service.name}</span>
      </td>
      <td className="py-4 pr-4 uppercase text-white/45">{service.kind}</td>
      <td className="py-4 pr-4">
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusTone(service.status)}`}>
          {service.status}
        </span>
      </td>
      <td className="py-4 pr-4">{service.cpuPercent !== null ? `${service.cpuPercent}%` : "—"}</td>
      <td className="py-4 pr-4">{service.memoryBytes !== null ? formatBytes(service.memoryBytes) : "—"}</td>
      <td className="py-4 pr-0">{service.uptimeSeconds !== null ? formatUptime(service.uptimeSeconds) : "—"}</td>
    </tr>
  );
}
