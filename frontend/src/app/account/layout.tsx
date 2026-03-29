"use client";

import { ReactNode, useMemo } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { authStorage } from "@/lib/auth";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const user = useMemo(() => authStorage.getUser(), []);

  return (
    <AccountShell userName={user?.fullName} userEmail={user?.email}>
      {children}
    </AccountShell>
  );
}
