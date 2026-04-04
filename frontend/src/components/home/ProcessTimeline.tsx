export function ProcessTimeline() {
  const steps = [
    { num: "01", title: "Source", desc: "Ethically sourced raw materials from trusted global suppliers.", icon: "🌿" },
    { num: "02", title: "Blend", desc: "Master perfumers craft unique accords in our Indian atelier.", icon: "⚗️" },
    { num: "03", title: "Age", desc: "Each fragrance rests 4-6 weeks to develop full character.", icon: "🕰" },
    { num: "04", title: "Bottle", desc: "Hand-filled into premium glass with quality-checked packaging.", icon: "✨" },
  ];

  return (
    <section id="process" className="py-20 px-[var(--px)] bg-white">
      <div className="mx-auto max-w-[var(--max-w)]">
        <div className="text-center mb-14 anim-up">
          <span className="section-tag">🔬 Our Process</span>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-bold text-[var(--text)]">
            From Ingredient to{" "}
            <em className="font-serif not-italic text-[var(--pop)]" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Icon
            </em>
          </h2>
          <p className="mt-3 text-[var(--text-2)] max-w-lg mx-auto">
            Every RYVEN fragrance follows a meticulous 4-step journey to ensure uncompromising quality.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative rounded-[var(--radius)] bg-[var(--bg)] p-8 anim-up group hover:-translate-y-1 transition-transform duration-300"
            >
              <span className="text-3xl mb-4 block">{step.icon}</span>
              <div className="text-xs font-bold text-[var(--pop)] tracking-wider mb-2">STEP {step.num}</div>
              <h3 className="text-xl font-bold text-[var(--text)] mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--text-2)] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
