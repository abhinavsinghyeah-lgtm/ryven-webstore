import type { Product } from "@/types/product";

type TestimonialsSectionProps = {
  products: Product[];
  config?: Record<string, string | number | boolean | null | undefined>;
};

const reviewNames = ["Aarav M.", "Siddhi R.", "Kabir V."];

export function TestimonialsSection({ products, config }: TestimonialsSectionProps) {
  const picks = products.slice(0, 3);
  const eyebrow = String(config?.eyebrow || "Testimonials");
  const title = String(config?.title || "Loved by repeat buyers");
  const subtitle = String(config?.subtitle || "Customer quotes and confidence-building proof.");
  const backgroundColor = String(config?.backgroundColor || "#f4f7fb");
  const textColor = String(config?.textColor || "#111827");
  const paddingTop = Number(config?.paddingTop || 56);
  const paddingBottom = Number(config?.paddingBottom || 64);

  return (
    <section style={{ backgroundColor, color: textColor, paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` }}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-65">{eyebrow}</p>
        <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-base opacity-70">{subtitle}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {picks.length ? (
            picks.map((product, index) => (
              <article key={product.id} className="rounded-[28px] border border-black/5 bg-white/85 p-7 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">{product.name}</p>
                <p className="mt-4 text-base leading-relaxed opacity-85">
                  &quot;Projection is sharp for the first two hours and the dry-down stays smooth. This became my
                  automatic pick for {index === 0 ? "office" : index === 1 ? "evenings" : "events"}.&quot;
                </p>
                <p className="mt-6 text-sm font-semibold opacity-75">{reviewNames[index] || "RYVEN buyer"}</p>
              </article>
            ))
          ) : (
            <p className="text-sm opacity-70">Customer reviews will appear once products are live.</p>
          )}
        </div>
      </div>
    </section>
  );
}
