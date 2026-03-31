import type { Product } from "@/types/product";

type TestimonialsSectionProps = {
  products: Product[];
};

const reviewNames = ["Aarav M.", "Siddhi R.", "Kabir V."];
const cardColors = [
  "from-pink-100 to-rose-100",
  "from-purple-100 to-blue-100",
  "from-yellow-100 to-orange-100",
];

export function TestimonialsSection({ products }: TestimonialsSectionProps) {
  const picks = products.slice(0, 3);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.3em] font-bold text-purple-600">Testimonials</p>
        <h2 className="mt-3 font-display text-5xl text-neutral-800 sm:text-6xl font-bold leading-tight">Loved by repeat buyers</h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {picks.length ? (
            picks.map((product, index) => (
              <article key={product.id} className={`rounded-2xl border-2 border-white/50 bg-gradient-to-br ${cardColors[index]} p-7 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1`}>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-purple-600">{product.name}</p>
                <p className="mt-4 text-base leading-relaxed text-neutral-800 font-medium">
                  &quot;Projection is sharp for the first two hours and the dry-down stays smooth. This became my
                  automatic pick for {index === 0 ? "office" : index === 1 ? "evenings" : "events"}.&quot;
                </p>
                <p className="mt-6 text-sm font-semibold text-neutral-700">{reviewNames[index] || "RYVEN buyer"}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-neutral-600">Customer reviews will appear once products are live.</p>
          )}
        </div>
      </div>
    </div>
  );
}
