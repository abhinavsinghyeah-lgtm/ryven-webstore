"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, AdminLoader, adminButtonClasses, adminInputClasses } from "@/components/admin/AdminShell";
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
  const [messageUserId, setMessageUserId] = useState<number | null>(null);
  const [messageForm, setMessageForm] = useState({ title: "", message: "" });

  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    if (!token || !user) { router.replace("/login"); return; }
    if (user.role !== "admin") { router.replace("/account"); return; }

    setLoading(true); setError(null);
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
      await apiRequest(`/admin/users/${userId}/role`, { method: "PATCH", token, body: { role } });
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
      await apiRequest(`/admin/users/${userId}/status`, { method: "PATCH", token, body: { isActive } });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive } : u)));
      setActionMessage("User status updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update user status");
    }
  };

  const sendMessage = async () => {
    const token = authStorage.getToken();
    if (!token || !messageUserId) return;
    setError(null); setActionMessage(null);
    try {
      await apiRequest(`/admin/users/${messageUserId}/notify`, { method: "POST", token, body: messageForm });
      setActionMessage("Message sent to user.");
      setMessageUserId(null); setMessageForm({ title: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send message");
    }
  };

  return (
    <AdminShell
      title="User Command"
      subtitle="Manage customer accounts, access levels, and audit trails."
      actions={<button type="button" className={adminButtonClasses.primary} onClick={() => setShowForm(true)}>Add user</button>}
    >
      {error && <StatusBanner tone="error" title="User error" description={error} />}
      {actionMessage && <StatusBanner tone="success" title="User updated" description={actionMessage} />}

      {loading ? <AdminLoader /> : (
        <>
          {/* Add user form */}
          <AdminCard>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p className="adm-section-label">Add new user</p>
                <p className="adm-section-sub">Create a user account directly from admin.</p>
              </div>
              <button type="button" className={adminButtonClasses.soft} onClick={() => setShowForm((p) => !p)}>{showForm ? "Hide form" : "Add user"}</button>
            </div>

            {showForm && (
              <form
                style={{ marginTop: 16, display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = authStorage.getToken();
                  if (!token) return;
                  setError(null); setActionMessage(null);
                  try {
                    const response = await apiRequest<{ user: AdminUsersListItem }>("/admin/users", { method: "POST", token, body: newUser });
                    setUsers((prev) => [response.user, ...prev]);
                    setNewUser({ fullName: "", email: "", phone: "", role: "customer" });
                    setActionMessage("User created."); setShowForm(false);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Unable to create user");
                  }
                }}
              >
                <div className="adm-form-group"><label className="adm-form-label">Full name</label><input className={adminInputClasses} required value={newUser.fullName} onChange={(e) => setNewUser((p) => ({ ...p, fullName: e.target.value }))} /></div>
                <div className="adm-form-group"><label className="adm-form-label">Email</label><input className={adminInputClasses} required value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} /></div>
                <div className="adm-form-group"><label className="adm-form-label">Phone (optional)</label><input className={adminInputClasses} value={newUser.phone} onChange={(e) => setNewUser((p) => ({ ...p, phone: e.target.value }))} /></div>
                <div className="adm-form-group"><label className="adm-form-label">Role</label><select className="adm-select" style={{ width: "100%" }} value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))}><option value="customer">Customer</option><option value="admin">Admin</option></select></div>
                <div style={{ gridColumn: "1/-1" }}><button type="submit" className={adminButtonClasses.primary}>Create user</button></div>
              </form>
            )}

            {/* Message form */}
            {messageUserId && (
              <div style={{ marginTop: 16, padding: 20, border: "1px solid var(--border-light)", borderRadius: 14 }}>
                <p className="adm-section-label">Message user</p>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div className="adm-form-group"><label className="adm-form-label">Notification title</label><input className={adminInputClasses} value={messageForm.title} onChange={(e) => setMessageForm((p) => ({ ...p, title: e.target.value }))} /></div>
                  <div className="adm-form-group"><label className="adm-form-label">Message</label><textarea className="adm-textarea" value={messageForm.message} onChange={(e) => setMessageForm((p) => ({ ...p, message: e.target.value }))} /></div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" className={adminButtonClasses.primary} onClick={sendMessage}>Send message</button>
                    <button type="button" className={adminButtonClasses.ghost} onClick={() => { setMessageUserId(null); setMessageForm({ title: "", message: "" }); }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </AdminCard>

          {/* User table */}
          <AdminCard>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p className="adm-section-label">User directory</p>
                <p className="adm-section-sub">Live user accounts and recent access history.</p>
              </div>
              <button
                type="button"
                className={adminButtonClasses.ghost}
                onClick={async () => {
                  const token = authStorage.getToken();
                  if (!token) return;
                  const response = await fetch("/api/v1/admin/users/export", { headers: { Authorization: `Bearer ${token}` } });
                  const blob = await response.blob();
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url; link.download = "users.csv"; link.click();
                  URL.revokeObjectURL(url);
                }}
              >Export list</button>
            </div>

            <div className="adm-table-wrap" style={{ marginTop: 16 }}>
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Seen</th>
                    <th>IP</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length ? users.map((entry) => (
                    <tr key={entry.id}>
                      <td style={{ fontWeight: 600 }}>{entry.fullName}</td>
                      <td>{entry.email}</td>
                      <td><span className={`adm-badge ${entry.role === "admin" ? "adm-badge-pop" : "adm-badge-gray"}`}>{entry.role}</span></td>
                      <td><span className={`adm-badge ${entry.isActive ? "adm-badge-green" : "adm-badge-red"}`}>{entry.isActive ? "Active" : "Disabled"}</span></td>
                      <td>{entry.lastSeen ? new Date(entry.lastSeen).toLocaleString() : "—"}</td>
                      <td>{entry.lastIp || "—"}</td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          <button type="button" className={adminButtonClasses.soft} onClick={() => updateRole(entry.id, entry.role === "admin" ? "customer" : "admin")}>
                            Make {entry.role === "admin" ? "Customer" : "Admin"}
                          </button>
                          <button type="button" className={adminButtonClasses.ghost} onClick={() => updateStatus(entry.id, !entry.isActive)}>
                            {entry.isActive ? "Disable" : "Enable"}
                          </button>
                          <button type="button" className={adminButtonClasses.ghost} onClick={() => { setMessageUserId(entry.id); setMessageForm({ title: `Message for ${entry.fullName}`, message: "" }); }}>
                            Message
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={7} style={{ color: "var(--text-3)" }}>No users found yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </>
      )}
    </AdminShell>
  );
}
