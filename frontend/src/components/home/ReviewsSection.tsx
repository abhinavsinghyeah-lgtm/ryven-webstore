export function ReviewsSection() {
  const overall = { rating: 4.9, total: "2,847", breakdown: [
    { stars: 5, pct: 82 },
    { stars: 4, pct: 12 },
    { stars: 3, pct: 4 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 1 },
  ]};

  const reviews = [
    { name: "Aditya K.", rating: 5, text: "Noir Velvet is incredible. I get compliments every single day. Lasts from morning to midnight easily.", product: "Noir Velvet", helpful: 24 },
    { name: "Priya S.", rating: 5, text: "Rose Absolue is my go-to. Elegant without being overpowering. Perfect for office and dinner alike.", product: "Rose Absolue", helpful: 18 },
    { name: "Rahul M.", rating: 5, text: "The packaging alone is worth it. But the scent? Absolutely premium. Can't believe this is Indian-made.", product: "Oud Royale", helpful: 31 },
    { name: "Sneha D.", rating: 4, text: "Amber Eclipse has the warmest, most inviting scent. My boyfriend keeps stealing it from me!", product: "Amber Eclipse", helpful: 15 },
  ];

  return (
    <section id="reviews" className="py-20 px-[var(--px)] bg-[var(--bg)]">
      <div className="mx-auto max-w-[var(--max-w)]">
        <div className="text-center mb-14 anim-up">
          <span className="section-tag">💬 What They Say</span>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-bold text-[var(--text)]">Customer Reviews</h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          {/* Summary */}
          <div className="rounded-2xl bg-white border border-[var(--border-light)] p-7 h-fit anim-up">
            <div className="text-center mb-5">
              <p className="text-5xl font-bold text-[var(--text)]">{overall.rating}</p>
              <p className="text-[var(--pop)] text-lg mt-1">★★★★★</p>
              <p className="text-xs text-[var(--text-3)] mt-1">Based on {overall.total} reviews</p>
            </div>
            <div className="space-y-2">
              {overall.breakdown.map((b) => (
                <div key={b.stars} className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-3)] w-4">{b.stars}★</span>
                  <div className="flex-1 h-2 rounded-full bg-[var(--border)]">
                    <div
                      className="h-2 rounded-full bg-[var(--pop)] transition-all duration-1000"
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--text-3)] w-8 text-right">{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((r) => (
              <div
                key={r.name}
                className="rounded-xl bg-white border border-[var(--border-light)] p-6 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 anim-up"
              >
                <div className="text-[var(--pop)] text-sm mb-3">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </div>
                <p className="text-sm text-[var(--text)] leading-relaxed">&quot;{r.text}&quot;</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">{r.name}</p>
                    <p className="text-[.7rem] text-[var(--text-3)]">Verified · {r.product}</p>
                  </div>
                  <span className="text-[.7rem] text-[var(--text-4)]">👍 {r.helpful} helpful</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
