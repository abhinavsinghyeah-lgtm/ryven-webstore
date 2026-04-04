"use client";
import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    // Reveal .anim-up elements on scroll
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("show");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".anim-up").forEach((el) => io.observe(el));

    // Longevity bar fill animation
    const longevityIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const w = el.style.getPropertyValue("--w");
            if (w) el.style.width = w;
            longevityIO.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll(".longevity-fill").forEach((el) => longevityIO.observe(el));

    // Review bar fill animation
    const reviewIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const w = el.style.getPropertyValue("--w");
            if (w) el.style.width = w;
            reviewIO.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll(".review-bar-fill").forEach((el) => reviewIO.observe(el));

    // Lazy image fade-in
    const imgIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const img = e.target as HTMLImageElement;
            img.style.opacity = "1";
            imgIO.unobserve(img);
          }
        });
      },
      { rootMargin: "100px" }
    );

    document.querySelectorAll<HTMLImageElement>("img[loading=\"lazy\"]").forEach((img) => {
      img.style.opacity = "0";
      img.style.transition = "opacity .5s ease";
      if (img.complete) {
        img.style.opacity = "1";
      } else {
        imgIO.observe(img);
      }
    });

    return () => {
      io.disconnect();
      longevityIO.disconnect();
      reviewIO.disconnect();
      imgIO.disconnect();
    };
  }, []);

  return null;
}
