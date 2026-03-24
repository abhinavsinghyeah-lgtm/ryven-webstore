import Link from "next/link";

import type { Product } from "@/types/product";

type CategoryShowcaseProps = {
  products: Product[];
};

const categoryColors: Record<string, string> = {
  "floral": "from-pink-300 to-rose-300",
  "woody": "from-amber-200 to-yellow-300",
  "fresh": "from-blue-200 to-cyan-300",
  "citrus": "from-yellow-100 to-orange-200",
  "fruity": "from-red-200 to-pink-300",
  "oriental": "from-purple-300 to-pink-300",
};

export function CategoryShowcase({ products }: CategoryShowcaseProps) {
  const categories = Array.from(new Set(products.map((item) => item.category))).slice(0, 6);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.3em] text-purple-600 font-bold">Shop by Category</p>
        <h2 className="mt-3 font-display text-5xl text-neutral-800 sm:text-6xl font-bold leading-tight">Build your fragrance stack</h2>

        <div className="mt-12 flex flex-wrap gap-4">
          {categories.length ? (
            categories.map((category) => {
              const colors = categoryColors[category.toLowerCase()] || "from-purple-300 to-pink-300";
              return (
                <Link 
                  key={category} 
                  href={`/products?q=${encodeURIComponent(category)}`} 
                  className={`inline-flex items-center justify-center px-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-br ${colors} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95`}
                >
                  {category}
                </Link>
              );
            })
          ) : (
            <p className="text-sm text-neutral-600">Categories will appear once products are available.</p>
          )}
        </div>

        <p className="mt-12 max-w-2xl text-sm leading-relaxed text-neutral-700 sm:text-base">
          Layer fresh top notes with resinous bases, or keep one clean profile as your signature. Each category is tuned
          for a distinct projection and skin evolution.
        </p>
      </div>
    </div>
  );
}
