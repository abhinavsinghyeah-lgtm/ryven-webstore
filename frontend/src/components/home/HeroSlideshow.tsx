"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type HeroSlide = {
  imageUrl: string;
  title: string;
  subtitle: string;
};

type HeroSlideshowProps = {
  slides: HeroSlide[];
};

export function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.imageUrl}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
        >
          <Image src={slide.imageUrl} alt={slide.title} fill priority={index === 0} className="object-cover" sizes="100vw" />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/75" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl items-end px-5 pb-14 pt-24 sm:px-8 sm:pb-16">
        <div className="max-w-2xl text-white fade-up">
          <p className="text-xs uppercase tracking-[0.28em] text-white/75">Launch Collection</p>
          <h1 className="mt-3 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            {slides[activeIndex].title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            {slides[activeIndex].subtitle}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/products" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900">
              Shop now
            </Link>
            <Link href="/about" className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white">
              Our story
            </Link>
          </div>

          <div className="mt-8 flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.imageUrl}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-8 bg-white" : "w-4 bg-white/45"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
