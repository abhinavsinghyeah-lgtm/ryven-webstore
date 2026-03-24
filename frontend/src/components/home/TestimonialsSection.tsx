import type { Product } from "@/types/product";

type TestimonialsSectionProps = {
  products: Product[];
};

const reviewNames = ["Aarav M.", "Siddhi R.", "Kabir V."];

export function TestimonialsSection({ products }: TestimonialsSectionProps) {
  const picks = products.slice(0, 3);

  return (
    <div className="min-h-screen border-b border-white/10 bg-[#07080a] px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/55">Testimonials</p>
        <h2 className="mt-3 font-display text-5xl text-white sm:text-6xl">Loved by repeat buyers</h2>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {picks.length ? (
            picks.map((product, index) => (
              <article key={product.id} className="rounded-3xl border border-white/15 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">{product.name}</p>
                <p className="mt-3 text-lg leading-relaxed text-white/90">
                  &quot;Projection is sharp for the first two hours and the dry-down stays smooth. This became my
                  automatic pick for {index === 0 ? "office" : index === 1 ? "evenings" : "events"}.&quot;
                </p>
                <p className="mt-5 text-sm font-semibold text-white/70">{reviewNames[index] || "RYVEN buyer"}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-white/70">Customer reviews will appear once products are live.</p>
          )}
        </div>
      </div>
    </div>
  );
}
