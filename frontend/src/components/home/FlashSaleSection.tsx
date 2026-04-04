"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function FlashSaleSection() {
  const [hours, setHours] = useState("14");
  const [mins, setMins] = useState("36");
  const [secs, setSecs] = useState("00");

  useEffect(() => {
    const end = Date.now() + 14 * 3600000 + 36 * 60000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setHours(String(Math.floor(diff / 3600000)).padStart(2, "0"));
      setMins(String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"));
      setSecs(String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-20 px-[var(--px)] bg-[var(--pop-light)]">
      <div className="mx-auto max-w-[var(--max-w)]">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left side */}
          <div className="flex-1 anim-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--pop)] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              🔥 Flash Sale — 40% Off
            </span>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-bold text-[var(--text)]">
              Luxury Fragrance Gift Set
            </h2>
            <p className="mt-3 text-[var(--text-2)] max-w-md">
              5 bestselling fragrances in one premium box. The perfect gift — or the perfect treat for yourself. Only 23 sets left at this price.
            </p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[var(--pop)]">₹3,599</span>
              <span className="text-lg text-[var(--text-4)] line-through">₹5,999</span>
              <span className="rounded-full bg-[var(--green-light)] text-[var(--green)] px-3 py-1 text-xs font-bold">SAVE ₹2,400</span>
            </div>

            <div className="mt-6">
              <p className="text-xs font-medium text-[var(--text-3)] uppercase tracking-wider mb-2">Offer ends in</p>
              <div className="flex gap-3">
                {[
                  { val: hours, label: "Hours" },
                  { val: mins, label: "Mins" },
                  { val: secs, label: "Secs" },
                ].map((t) => (
                  <div key={t.label} className="text-center">
                    <span className="block bg-[var(--accent)] text-white text-2xl font-bold px-4 py-3 rounded-xl font-mono min-w-[60px]">
                      {t.val}
                    </span>
                    <span className="text-[.7rem] text-[var(--text-3)] mt-1 block">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/products" className="btn btn-pop mt-8 inline-flex">
              Grab This Deal →
            </Link>
          </div>

          {/* Right - product visual placeholder */}
          <div className="flex-1 flex justify-center anim-up">
            <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-[var(--pop)]/10 to-[var(--pop)]/5 border border-[var(--pop)]/20 flex items-center justify-center">
              <span className="text-6xl">🎁</span>
            </div>
          </div>
        </div>

        {/* Urgency bar */}
        <div className="mt-10 flex items-center gap-3 rounded-xl bg-white/80 border border-[var(--border)] px-5 py-3 anim-up">
          <span className="text-sm">🔥</span>
          <div className="flex-1">
            <div className="h-2 rounded-full bg-[var(--border)]">
              <div className="h-2 rounded-full bg-[var(--pop)] transition-all" style={{ width: "77%" }} />
            </div>
          </div>
          <span className="text-xs font-medium text-[var(--text-2)]">77% claimed — 23 sets left</span>
        </div>
      </div>
    </section>
  );
}
