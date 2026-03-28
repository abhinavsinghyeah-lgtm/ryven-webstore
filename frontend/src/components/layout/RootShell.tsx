"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome =
    pathname?.startsWith("/coming-soon") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup");

  return (
    <>
      {!hideChrome && <SiteHeader />}
      <div className="flex-1">{children}</div>
      {!hideChrome && <SiteFooter />}
    </>
  );
}
