export function BrandMarquee() {
  const items = [
    "RYVEN PERFUMES",
    "★",
    "CRAFTED IN INDIA",
    "★",
    "LONG-LASTING",
    "★",
    "PREMIUM INGREDIENTS",
    "★",
    "FREE SHIPPING",
    "★",
    "RYVEN PERFUMES",
    "★",
    "CRAFTED IN INDIA",
    "★",
    "LONG-LASTING",
    "★",
    "PREMIUM INGREDIENTS",
    "★",
    "FREE SHIPPING",
    "★",
  ];

  return (
    <section className="overflow-hidden border-y border-[var(--border)] bg-white py-5">
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{ animation: "marquee 25s linear infinite", width: "max-content" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className={`text-sm font-medium tracking-[.08em] uppercase ${
              item === "★" ? "text-[var(--pop)] text-xs" : "text-[var(--text-3)]"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
