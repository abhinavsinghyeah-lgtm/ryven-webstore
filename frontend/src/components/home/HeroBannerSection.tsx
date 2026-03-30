import Image from "next/image";
import Link from "next/link";

import type { StoreSettings } from "@/types/auth";

type HeroBannerSectionProps = {
  settings: StoreSettings | null;
  config?: Record<string, string | number | boolean | null | undefined>;
};

const defaultHeroImage =
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1800&auto=format&fit=crop";

export function HeroBannerSection({ settings, config }: HeroBannerSectionProps) {
  const heroImage = String(config?.imageUrl || "") || settings?.heroImageUrl || settings?.logoUrl || defaultHeroImage;
  const minHeight = Number(config?.minHeight || 100);
  const overlayOpacity = Number(config?.overlayOpacity || 38);
  const textColor = String(config?.textColor || "#ffffff");
  const contentAlign = String(config?.contentAlign || "left");
  const buttonLabel = String(config?.buttonLabel || "");
  const buttonHref = String(config?.buttonHref || "/products");
  const eyebrow = String(config?.eyebrow || settings?.storeName || "RYVEN");
  const title = String(config?.title || settings?.tagline || "Modern fragrance, shaped for everyday rituals.");
  const subtitle = String(config?.subtitle || "");
  const objectPosition = String(config?.objectPosition || "center");

  const alignmentClass =
    contentAlign === "center"
      ? "items-center justify-center text-center"
      : contentAlign === "right"
        ? "items-center justify-end text-right"
        : "items-center justify-start text-left";

  return (
    <section className="relative overflow-hidden" style={{ minHeight: `${minHeight}vh` }}>
      <Image
        src={heroImage}
        alt={settings?.storeName || "RYVEN hero"}
        fill
        priority
        className="object-cover"
        style={{ objectPosition }}
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/55" style={{ opacity: overlayOpacity / 100 }} />

      <div className="absolute inset-0">
        <div className={`mx-auto flex min-h-full w-full max-w-6xl px-5 py-28 sm:px-8 ${alignmentClass}`}>
          <div className="max-w-3xl" style={{ color: textColor }}>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] opacity-80">{eyebrow}</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">{title}</h1>
            {subtitle ? <p className="mt-5 max-w-2xl text-base leading-8 opacity-85 sm:text-lg">{subtitle}</p> : null}
            {buttonLabel ? (
              <Link
                href={buttonHref}
                className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:-translate-y-0.5"
              >
                {buttonLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
