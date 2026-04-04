import Link from "next/link";

export function QuizCTA() {
  const steps = [
    { num: "1", text: "Answer 3 quick questions" },
    { num: "2", text: "We match your scent profile" },
    { num: "3", text: "Get personalized picks" },
  ];

  return (
    <section className="py-20 px-[var(--px)] bg-[var(--accent)] text-white">
      <div className="mx-auto max-w-[var(--max-w)] text-center">
        <div className="anim-up">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold">
            Not Sure Where to Start?
          </h2>
          <p className="mt-4 text-white/70 max-w-md mx-auto">
            Take our 60-second fragrance quiz and get personalized recommendations based on your style and mood.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-8 anim-up">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-white/30 text-sm font-bold">
                {s.num}
              </span>
              <span className="text-sm text-white/80">{s.text}</span>
              {i < steps.length - 1 && (
                <span className="hidden sm:block text-white/30 ml-4">→</span>
              )}
            </div>
          ))}
        </div>

        <Link href="/products" className="btn mt-10 inline-flex bg-white text-[var(--accent)] hover:bg-white/90 anim-up">
          Take the Quiz →
        </Link>
      </div>
    </section>
  );
}
