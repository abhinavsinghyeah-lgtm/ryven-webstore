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
      <div className="flex-1" style={!hideChrome ? { paddingTop: "calc(var(--nav-h) + var(--announce-h))" } : undefined}>
        {children}
      </div>
      {!hideChrome && <SiteFooter />}
    </>
  );
}
