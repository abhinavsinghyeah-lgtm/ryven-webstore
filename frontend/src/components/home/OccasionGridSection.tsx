import Link from "next/link";
import type { Collection } from "@/types/collection";

type OccasionGridProps = {
  collections: Collection[];
};

const fallbackOccasions = [
  { name: "Date Night", emoji: "🌹", desc: "Seductive & warm" },
  { name: "Office Power", emoji: "💼", desc: "Clean & confident" },
  { name: "Wedding Season", emoji: "✨", desc: "Grand & luxurious" },
  { name: "Weekend Vibes", emoji: "🎧", desc: "Fresh & easygoing" },
  { name: "Gifting", emoji: "🎁", desc: "Perfect presents" },
  { name: "Travel Ready", emoji: "✈️", desc: "Compact & bold" },
];

export function OccasionGridSection({ collections }: OccasionGridProps) {
  const hasCollections = collections.length > 0;

  return (
    <section id="occasion" className="py-20 px-[var(--px)] bg-white">
      <div className="mx-auto max-w-[var(--max-w)]">
        <div className="text-center mb-14 anim-up">
          <span className="section-tag">🎯 Perfect For Every Moment</span>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-bold text-[var(--text)]">Shop by Occasion</h2>
          <p className="mt-3 text-[var(--text-2)] max-w-lg mx-auto">
            Find the perfect fragrance for every moment. Curated collections for life&apos;s best occasions.
          </p>
        </div>

        {hasCollections ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collections.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className="group relative overflow-hidden rounded-[var(--radius)] bg-[var(--bg-warm)] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg anim-up"
              >
                <h3 className="text-lg font-semibold text-[var(--text)] group-hover:text-[var(--pop)] transition-colors">
                  {c.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-3)]">{c.productCount} products</p>
                <span className="absolute top-6 right-6 text-[var(--text-4)] group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackOccasions.map((o) => (
              <Link
                key={o.name}
                href="/products"
                className="group relative overflow-hidden rounded-[var(--radius)] bg-[var(--bg-warm)] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg anim-up"
              >
                <span className="text-2xl">{o.emoji}</span>
                <h3 className="mt-3 text-lg font-semibold text-[var(--text)] group-hover:text-[var(--pop)] transition-colors">
                  {o.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-3)]">{o.desc}</p>
                <span className="absolute top-6 right-6 text-[var(--text-4)] group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
