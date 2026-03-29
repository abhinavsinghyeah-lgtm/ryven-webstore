"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, adminButtonClasses } from "@/components/admin/AdminShell";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { authStorage } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import type { AdminUsersResponse, AdminUsersListItem } from "@/types/dashboard";

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUsersListItem[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: "", email: "", phone: "", role: "customer" });

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
    apiRequest<AdminUsersResponse>("/admin/users?limit=30&offset=0", { token })
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load users"))
      .finally(() => setLoading(false));
  }, [router]);

  const updateRole = async (userId: number, role: "admin" | "customer") => {
    const token = authStorage.getToken();
    if (!token) return;
    setActionMessage(null);
    try {
      await apiRequest(`/admin/users/${userId}/role`, {
        method: "PATCH",
        token,
        body: { role },
      });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      setActionMessage("User role updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update role");
    }
  };

  const updateStatus = async (userId: number, isActive: boolean) => {
    const token = authStorage.getToken();
    if (!token) return;
    setActionMessage(null);
    try {
      await apiRequest(`/admin/users/${userId}/status`, {
        method: "PATCH",
        token,
        body: { isActive },
      });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive } : u)));
      setActionMessage("User status updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update user status");
    }
  };

  return (
    <AdminShell
      title="User Command"
      subtitle="Manage customer accounts, access levels, and audit trails."
      actions={
        <button type="button" className={adminButtonClasses.primary} onClick={() => setShowForm(true)}>
          Add user
        </button>
      }
    >
      {error ? <StatusBanner tone="error" title="User error" description={error} /> : null}
      {actionMessage ? <StatusBanner tone="success" title="User updated" description={actionMessage} /> : null}

      {loading ? (
        <AdminLoader label="Loading users..." />
      ) : (
        <>
          <AdminCard>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Add new user</p>
                <p className="mt-1 text-sm text-white/60">Create a user account directly from admin.</p>
              </div>
              <button type="button" className={adminButtonClasses.soft} onClick={() => setShowForm((prev) => !prev)}>
                {showForm ? "Hide form" : "Add user"}
              </button>
            </div>

            {showForm ? (
              <form
                className="mt-4 grid gap-3 md:grid-cols-2"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const token = authStorage.getToken();
                  if (!token) return;
                  setError(null);
                  setActionMessage(null);
                  try {
                    const response = await apiRequest<{ user: AdminUsersListItem }>("/admin/users", {
                      method: "POST",
                      token,
                      body: newUser,
                    });
                    setUsers((prev) => [response.user, ...prev]);
                    setNewUser({ fullName: "", email: "", phone: "", role: "customer" });
                    setActionMessage("User created.");
                    setShowForm(false);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Unable to create user");
                  }
                }}
              >
                <input
                  value={newUser.fullName}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, fullName: event.target.value }))}
                  placeholder="Full name"
                  className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                  required
                />
                <input
                  value={newUser.email}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="Email"
                  className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                  required
                />
                <input
                  value={newUser.phone}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="Phone (optional)"
                  className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                />
                <select
                  value={newUser.role}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, role: event.target.value }))}
                  className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="md:col-span-2">
                  <button type="submit" className={adminButtonClasses.primary}>
                    Create user
                  </button>
                </div>
              </form>
            ) : null}
          </AdminCard>

          <AdminCard>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">User directory</p>
                <p className="mt-1 text-sm text-white/60">Live user accounts and recent access history.</p>
              </div>
              <button
                type="button"
                className={adminButtonClasses.ghost}
                onClick={async () => {
                  const token = authStorage.getToken();
                  if (!token) return;
                  const response = await fetch("/api/v1/admin/users/export", {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const blob = await response.blob();
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "users.csv";
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export list
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.24em] text-white/50">
                    <th className="py-3 pr-4 font-medium">User</th>
                    <th className="py-3 pr-4 font-medium">Email</th>
                    <th className="py-3 pr-4 font-medium">Role</th>
                    <th className="py-3 pr-4 font-medium">Status</th>
                    <th className="py-3 pr-4 font-medium">Last Seen</th>
                    <th className="py-3 pr-4 font-medium">IP</th>
                    <th className="py-3 pr-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length ? (
                    users.map((entry) => (
                      <tr key={entry.id} className="border-b border-white/5 text-white/70">
                        <td className="py-4 pr-4 font-semibold text-white">{entry.fullName}</td>
                        <td className="py-4 pr-4">{entry.email}</td>
                        <td className="py-4 pr-4">{entry.role}</td>
                        <td className="py-4 pr-4">{entry.isActive ? "Active" : "Disabled"}</td>
                        <td className="py-4 pr-4">
                          {entry.lastSeen ? new Date(entry.lastSeen).toLocaleString() : "—"}
                        </td>
                        <td className="py-4 pr-4">{entry.lastIp || "—"}</td>
                        <td className="py-4 pr-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className={adminButtonClasses.soft}
                              onClick={() => updateRole(entry.id, entry.role === "admin" ? "customer" : "admin")}
                            >
                              Make {entry.role === "admin" ? "Customer" : "Admin"}
                            </button>
                            <button
                              type="button"
                              className={adminButtonClasses.ghost}
                              onClick={() => updateStatus(entry.id, !entry.isActive)}
                            >
                              {entry.isActive ? "Disable" : "Enable"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-4 pr-4 text-white/50" colSpan={7}>
                        No users found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </AdminCard>

          <section className="grid gap-6 lg:grid-cols-2">
            <AdminCard>
              <p className="text-sm font-semibold text-white">Audit timeline</p>
              <div className="mt-4 space-y-3">
                <TimelineRow title="Access logs" detail="Live sessions are visible in Engagement." />
                <TimelineRow title="Role changes" detail="Every role update is applied instantly." />
              </div>
            </AdminCard>

            <AdminCard>
              <p className="text-sm font-semibold text-white">Bulk actions</p>
              <p className="mt-2 text-sm text-white/60">
                Bulk controls are available in phase 2. For now, manage users directly in the table above.
              </p>
            </AdminCard>
          </section>
        </>
      )}
    </AdminShell>
  );
}

function TimelineRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-white/60">{detail}</p>
    </div>
  );
}
