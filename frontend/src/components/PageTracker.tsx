"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ryven.in/api/v1";

export default function PageTracker() {
  const pathname = usePathname();
  const lastPath = useRef("");

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    // Don't track admin pages — those already go through API middleware
    if (pathname.startsWith("/admin")) return;

    const sendBeacon = () => {
      try {
        const body = JSON.stringify({
          path: pathname,
          referrer: document.referrer || "",
        });

        // Use sendBeacon for reliability (fires even on page unload)
        if (navigator.sendBeacon) {
          const blob = new Blob([body], { type: "application/json" });
          navigator.sendBeacon(`${API_BASE}/track`, blob);
        } else {
          fetch(`${API_BASE}/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            credentials: "include",
            keepalive: true,
          }).catch(() => {});
        }
      } catch {}
    };

    // Small delay to not block page render
    const id = setTimeout(sendBeacon, 100);
    return () => clearTimeout(id);
  }, [pathname]);

  return null;
}
