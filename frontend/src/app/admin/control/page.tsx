"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, adminButtonClasses } from "@/components/admin/AdminShell";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { authStorage } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import type { AdminControlStatusResponse, ControlErrorLogsResponse } from "@/types/dashboard";

export default function AdminControlPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AdminControlStatusResponse | null>(null);
  const [logs, setLogs] = useState<ControlErrorLogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [secret, setSecret] = useState("");

  const fetchData = async () => {
    const token = authStorage.getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [statusData, logsData] = await Promise.all([
        apiRequest<AdminControlStatusResponse>("/admin/control/status", { token }),
        apiRequest<ControlErrorLogsResponse>("/admin/control/errors", { token }),
      ]);
      setStatus(statusData);
      setLogs(logsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load control data");
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
    void fetchData();
  }, [router]);

  const runAction = async (action: string) => {
    const token = authStorage.getToken();
    if (!token) return;
    setActionMessage(null);
    setError(null);

    try {
      const response = await apiRequest<{ status: string; output?: string }>("/admin/control/action", {
        method: "POST",
        token,
        body: { action, secret: secret.trim() || undefined },
      });
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
      subtitle="Monitor system health, review errors, and prepare operational actions."
      actions={
        <button type="button" className={adminButtonClasses.soft} onClick={fetchData}>
          Refresh status
        </button>
      }
    >
      {error ? <StatusBanner tone="error" title="Control error" description={error} /> : null}
      {actionMessage ? <StatusBanner tone="success" title="Action complete" description={actionMessage} /> : null}

      {loading ? (
        <AdminLoader label="Loading system status..." />
      ) : (
        <>
          <section className="grid gap-4 lg:grid-cols-3">
            {[
              { title: "Frontend", status: "Online", detail: "Next.js app healthy" },
              { title: "Backend API", status: "Online", detail: `Uptime ${uptimeText}` },
              { title: "Database", status: status?.data?.dbConnected ? "Online" : "Offline", detail: "Primary database connected" },
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
                {status?.data?.controlActionsEnabled
                  ? "Enter the control secret to run a secured action."
                  : "Control actions are disabled. Set CONTROL_ACTIONS_SECRET to enable."}
              </p>

              <form
                className="mt-4 space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  runAction("restart-frontend");
                }}
              >
                <input
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                  placeholder="Control secret"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="submit" className={`${adminButtonClasses.ghost} justify-center`} disabled={!status?.data?.controlActionsEnabled}>
                    Restart frontend
                  </button>
                  <button
                    type="button"
                    className={`${adminButtonClasses.ghost} justify-center`}
                    disabled={!status?.data?.controlActionsEnabled}
                    onClick={() => runAction("restart-backend")}
                  >
                    Restart backend
                  </button>
                  <button
                    type="button"
                    className={`${adminButtonClasses.ghost} justify-center`}
                    disabled={!status?.data?.controlActionsEnabled}
                    onClick={() => runAction("reload-nginx")}
                  >
                    Reload nginx
                  </button>
                </div>
              </form>
            </AdminCard>

            <AdminCard>
              <p className="text-sm font-semibold text-white">Errors & warnings</p>
              <div className="mt-4 space-y-3">
                {logs?.logs?.length ? (
                  logs.logs.map((log) => (
                    <LogRow
                      key={log.id}
                      title={`${log.method} ${log.path}`}
                      detail={`${log.status} · ${log.email || "Guest"} · ${new Date(log.createdAt).toLocaleString()}`}
                    />
                  ))
                ) : (
                  <EmptyRow message="No warnings captured yet. Logs will appear here." />
                )}
              </div>
            </AdminCard>
          </section>

          <AdminCard>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Activity log</p>
              <span className="text-xs uppercase tracking-[0.24em] text-white/50">Recent events</span>
            </div>
            <div className="mt-4 space-y-3">
              {logs?.logs?.length ? (
                logs.logs.map((log) => (
                  <LogRow
                    key={`activity-${log.id}`}
                    title={`${log.method} ${log.path}`}
                    detail={`${log.status} · ${log.ip || "Unknown IP"}`}
                  />
                ))
              ) : (
                <EmptyRow message="No recent activity captured yet." />
              )}
            </div>
          </AdminCard>
        </>
      )}
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
