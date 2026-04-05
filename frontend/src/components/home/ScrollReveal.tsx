"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".anim-up").forEach((el) => revealObserver.observe(el));

    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            const el = target as HTMLElement;
            const w = getComputedStyle(el).getPropertyValue("--w");
            if (w) el.style.width = w;
            barObserver.unobserve(target);
          }
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll(".longevity-fill, .review-bar-fill").forEach((b) =>
      barObserver.observe(b)
    );

    return () => {
      revealObserver.disconnect();
      barObserver.disconnect();
    };
  }, []);

  return null;
}
