import Link from "next/link";

import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

type ProductCollectionSectionProps = {
  products: Product[];
  config?: Record<string, string | number | boolean | null | undefined>;
};

export function ProductCollectionSection({ products, config }: ProductCollectionSectionProps) {
  const eyebrow = String(config?.eyebrow || "Collection");
  const title = String(config?.title || "All Live Products");
  const subtitle = String(config?.subtitle || "Curated fragrances, crafted to feel modern and unmistakably premium.");
  const ctaLabel = String(config?.ctaLabel || "View full catalog");
  const ctaHref = String(config?.ctaHref || "/products");
  const backgroundColor = String(config?.backgroundColor || "#f7f5f2");
  const textColor = String(config?.textColor || "#111827");
  const paddingTop = Number(config?.paddingTop || 56);
  const paddingBottom = Number(config?.paddingBottom || 64);
  const maxItems = Number(config?.maxItems || 6);
  const columnsDesktop = Number(config?.columnsDesktop || 3);

  const shownProducts = products.slice(0, maxItems);
  const columnsClass =
    columnsDesktop >= 4 ? "lg:grid-cols-4" : columnsDesktop === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

  return (
    <section style={{ backgroundColor, paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px`, color: textColor }}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] opacity-65">{eyebrow}</p>
            <h2 className="mt-2 text-4xl font-semibold sm:text-5xl">{title}</h2>
            <p className="mt-2 max-w-xl text-sm opacity-70">{subtitle}</p>
          </div>
          <Link href={ctaHref} className="text-xs font-semibold uppercase tracking-[0.24em] opacity-75 transition hover:opacity-100">
            {ctaLabel}
          </Link>
        </div>

        {shownProducts.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-black/5 bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-sm text-neutral-700">No live products yet. Add products from admin to show them here.</p>
          </div>
        ) : (
          <div className={`mt-10 grid gap-6 sm:grid-cols-2 ${columnsClass}`}>
            {shownProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
