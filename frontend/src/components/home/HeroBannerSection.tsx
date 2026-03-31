import Image from "next/image";

import type { StoreSettings } from "@/types/auth";

type HeroBannerSectionProps = {
  settings: StoreSettings | null;
};

const defaultHeroImage =
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1800&auto=format&fit=crop";

export function HeroBannerSection({ settings }: HeroBannerSectionProps) {
  const heroImage = settings?.heroImageUrl || settings?.logoUrl || defaultHeroImage;

  return (
    <section className="relative min-h-screen overflow-hidden">
      <Image
        src={heroImage}
        alt={settings?.storeName || "RYVEN hero"}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/40" />
    </section>
  );
}
