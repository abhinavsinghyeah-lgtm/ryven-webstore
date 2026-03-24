import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/product";

type PremiumHeroProps = {
  product: Product | null;
};

export function PremiumHero({ product }: PremiumHeroProps) {
  const imageUrl =
    product?.imageUrl ||
    "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1800&auto=format&fit=crop";

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 pt-24 flex items-center justify-center">
      {/* Decorative blobs */}
      <div className="absolute top-12 left-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }}></div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col-reverse items-center justify-between gap-12 px-5 sm:flex-row sm:px-8">
        {/* Left Content */}
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-purple-600">Essence Collection</p>
            <h1 className="font-display text-5xl sm:text-6xl font-bold leading-tight bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Capture Your Moment
            </h1>
            <p className="max-w-sm text-lg text-neutral-600">
              Discover fragrances crafted to express your unique essence and elevate every moment.
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="/products" className="brand-btn-primary">
              Shop Now
            </Link>
            <Link href="/about" className="brand-btn-ghost">
              Learn More
            </Link>
          </div>
        </div>

        {/* Right: Floating Product Image */}
        <div className="relative w-full sm:w-auto flex justify-center">
          <div className="relative w-72 h-96 sm:w-80 sm:h-[28rem]">
            {/* Soft shadow/glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-blue-300 rounded-3xl opacity-20 blur-2xl"></div>

            {/* Floating container */}
            <div className="soft-float relative w-full h-full rounded-3xl overflow-hidden border-2 border-white/60 shadow-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <Image
                src={imageUrl}
                alt={product?.name || "Featured fragrance"}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
