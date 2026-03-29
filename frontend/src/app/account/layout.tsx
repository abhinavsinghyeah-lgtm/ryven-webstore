"use client";

import { ReactNode, useEffect, useState } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { authStorage } from "@/lib/auth";
import type { AuthResponse } from "@/types/auth";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);

  useEffect(() => {
    setUser(authStorage.getUser());
  }, []);

  return (
    <AccountShell userName={user?.fullName} userEmail={user?.email}>
      {children}
    </AccountShell>
  );
}
