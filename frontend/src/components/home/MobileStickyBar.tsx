"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function MobileStickyBar() {
  const [visible, setVisible] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const pastHero = y > 600;

      if (!pastHero) {
        setVisible(false);
      } else if (y < lastY.current - 5) {
        setVisible(true); // scrolling up
      } else if (y > lastY.current + 8) {
        setVisible(false); // scrolling down
      }
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-[var(--border)] px-4 py-3 flex items-center gap-3 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--text)] truncate">Summer Sale — 25% Off</p>
        <p className="text-[.7rem] text-[var(--text-3)]">Code: RYVEN25</p>
      </div>
      <Link href="/products" className="btn btn-pop btn-sm whitespace-nowrap">
        Shop Now
      </Link>
    </div>
  );
}
