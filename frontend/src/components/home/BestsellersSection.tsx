import Link from "next/link";

export function BestsellersSection() {
  const bestsellers = [
    {
      rank: "#1",
      name: "Noir Velvet",
      desc: "Bold. Dark. Unforgettable. Our signature oud-amber blend that turns heads and lingers for hours.",
      price: "₹3,749",
      originalPrice: "₹4,999",
      longevity: 92,
      hours: "14hrs",
      image: null,
    },
    {
      rank: "#2",
      name: "Rose Absolue",
      desc: "Modern rose meets clean musk. A sophisticated floral that works day-to-night effortlessly.",
      price: "₹2,999",
      originalPrice: null,
      longevity: 85,
      hours: "12hrs",
      image: null,
    },
  ];

  return (
    <section id="bestsellers" className="py-20 px-[var(--px)] bg-white">
      <div className="mx-auto max-w-[var(--max-w)]">
        <div className="text-center mb-14 anim-up">
          <span className="section-tag">🏆 Most Loved</span>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-bold text-[var(--text)]">Best Sellers</h2>
          <p className="mt-3 text-[var(--text-2)] max-w-lg mx-auto">
            The fragrances our customers keep coming back for.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {bestsellers.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl bg-[var(--bg)] border border-[var(--border-light)] overflow-hidden anim-up"
            >
              {/* Image area */}
              <div className="aspect-[16/9] bg-gradient-to-br from-[var(--bg-warm)] to-[var(--bg)] flex items-center justify-center relative">
                <span className="text-6xl">🧴</span>
                <span className="absolute top-4 left-4 bg-[var(--accent)] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {item.rank} Best Seller
                </span>
              </div>

              {/* Info */}
              <div className="p-7">
                <h3 className="text-2xl font-bold text-[var(--text)]">{item.name}</h3>
                <p className="mt-2 text-sm text-[var(--text-2)] leading-relaxed">{item.desc}</p>

                {/* Longevity bar */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs text-[var(--text-3)] mb-2">
                    <span>Longevity Score</span>
                    <span className="font-bold text-[var(--text)]">{item.longevity}% — {item.hours}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--border)]">
                    <div
                      className="h-2 rounded-full bg-[var(--green)] transition-all duration-1000"
                      style={{ width: `${item.longevity}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[var(--text)]">{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-[var(--text-4)] line-through">{item.originalPrice}</span>
                    )}
                  </div>
                  <Link href="/products" className="btn btn-primary btn-sm">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
