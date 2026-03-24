import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/product";

type PremiumHeroProps = {
  product: Product | null;
  storeName?: string;
};

export function PremiumHero({ product, storeName }: PremiumHeroProps) {
  const imageUrl =
    product?.imageUrl ||
    "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1800&auto=format&fit=crop";

  return (
    <section className="relative min-h-screen overflow-hidden border-b border-white/10">
      <Image
        src={imageUrl}
        alt={product?.name || "RYVEN Hero"}
        fill
        className="object-cover opacity-40"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(255,255,255,0.2)_0%,rgba(0,0,0,0.8)_50%,rgba(0,0,0,0.96)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 sm:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="fade-up">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Perfume House</p>
            <h1 className="mt-4 font-display text-6xl leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">
              {storeName || "RYVEN"}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              Modern scent architecture for people who want presence. Clean opening, addictive heart, unforgettable
              dry-down.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="brand-btn-primary">
                Shop now
              </Link>
              <Link href="/about" className="brand-btn-ghost">
                About the house
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[60vh] w-full max-w-md lg:h-[74vh]">
            <div className="absolute inset-x-8 bottom-0 h-24 rounded-full bg-white/25 blur-2xl" />
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/25 bg-black/30 p-3 backdrop-blur-sm">
              <Image
                src={imageUrl}
                alt={product?.name || "Featured fragrance"}
                fill
                className="rounded-[1.5rem] object-cover"
                sizes="(max-width: 1024px) 80vw, 34vw"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-black/45 p-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.2em] text-white/65">Launch pick</p>
                <p className="mt-1 text-lg font-semibold text-white">{product?.name || "RYVEN Signature"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
