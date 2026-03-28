"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, adminButtonClasses } from "@/components/admin/AdminShell";
import { authStorage } from "@/lib/auth";

export default function AdminUsersPage() {
  const router = useRouter();

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
      title="User Command"
      subtitle="Manage customer accounts, access levels, and audit trails."
      actions={
        <button type="button" className={adminButtonClasses.primary}>
          Add user
        </button>
      }
    >
      <AdminCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">User directory</p>
            <p className="mt-1 text-sm text-white/60">Phase 2 will populate live user and IP data.</p>
          </div>
          <button type="button" className={adminButtonClasses.ghost}>
            Export list
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.24em] text-white/50">
                <th className="py-3 pr-4 font-medium">User</th>
                <th className="py-3 pr-4 font-medium">Email</th>
                <th className="py-3 pr-4 font-medium">Role</th>
                <th className="py-3 pr-4 font-medium">Last Seen</th>
                <th className="py-3 pr-4 font-medium">IP</th>
                <th className="py-3 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5 text-white/70">
                <td className="py-4 pr-4 font-semibold text-white">Sample User</td>
                <td className="py-4 pr-4">user@example.com</td>
                <td className="py-4 pr-4">Customer</td>
                <td className="py-4 pr-4">Just now</td>
                <td className="py-4 pr-4">203.0.113.42</td>
                <td className="py-4 pr-4">
                  <button type="button" className={adminButtonClasses.soft}>
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AdminCard>

      <section className="grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <p className="text-sm font-semibold text-white">Audit timeline</p>
          <div className="mt-4 space-y-3">
            <TimelineRow title="Access logs" detail="Coming soon with per-user session history." />
            <TimelineRow title="Role changes" detail="Track admin updates to accounts." />
          </div>
        </AdminCard>

        <AdminCard>
          <p className="text-sm font-semibold text-white">Bulk actions</p>
          <p className="mt-2 text-sm text-white/60">
            Phase 2 will allow bulk role updates, user deactivation, and password resets.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" className={adminButtonClasses.ghost} disabled>
              Disable user
            </button>
            <button type="button" className={adminButtonClasses.ghost} disabled>
              Reset access
            </button>
          </div>
        </AdminCard>
      </section>
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
