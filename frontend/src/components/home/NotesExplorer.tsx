export function NotesExplorer() {
  const families = [
    { name: "Woody", icon: "🪵", notes: "Sandalwood, Cedar, Vetiver", color: "#8B6914" },
    { name: "Floral", icon: "🌸", notes: "Rose, Jasmine, Iris", color: "#D4627A" },
    { name: "Oriental", icon: "🕌", notes: "Amber, Vanilla, Musk", color: "#B8860B" },
    { name: "Fresh", icon: "🍃", notes: "Bergamot, Mint, Green Tea", color: "#2D7A4F" },
    { name: "Aquatic", icon: "🌊", notes: "Sea Salt, Ozone, Water Lily", color: "#3A7CA5" },
    { name: "Citrus", icon: "🍊", notes: "Lemon, Orange, Grapefruit", color: "#E8891C" },
  ];

  return (
    <section className="py-20 px-[var(--px)] bg-[var(--bg-warm)]">
      <div className="mx-auto max-w-[var(--max-w)]">
        <div className="text-center mb-14 anim-up">
          <span className="section-tag">🧪 Scent Guide</span>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-bold text-[var(--text)]">Explore Fragrance Notes</h2>
          <p className="mt-3 text-[var(--text-2)] max-w-lg mx-auto">
            Not sure what you like? Explore the major fragrance families to find your perfect match.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {families.map((f) => (
            <div
              key={f.name}
              className="rounded-[var(--radius)] bg-white border border-[var(--border-light)] p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer anim-up"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="text-lg font-bold text-[var(--text)]">{f.name}</h3>
              </div>
              <p className="text-sm text-[var(--text-3)]">{f.notes}</p>
              <div className="mt-3 h-1 rounded-full bg-[var(--border)]">
                <div className="h-1 rounded-full w-2/3" style={{ background: f.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
