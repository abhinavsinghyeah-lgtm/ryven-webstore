"use client";

import { useState } from "react";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-20 px-[var(--px)] bg-[var(--bg-warm)]">
      <div className="mx-auto max-w-2xl text-center anim-up">
        <h2 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-bold text-[var(--text)]">
          Stay in the Loop
        </h2>
        <p className="mt-3 text-[var(--text-2)]">
          Get exclusive drops, early access to new fragrances, and 10% off your first order.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="flex-1 px-5 py-3.5 rounded-full border border-[var(--border)] bg-white text-sm text-[var(--text)] placeholder:text-[var(--text-4)] outline-none focus:border-[var(--accent)] transition-colors"
          />
          <button
            type="submit"
            className="btn btn-primary whitespace-nowrap"
            style={submitted ? { background: "var(--green)" } : undefined}
          >
            {submitted ? "✓ You're in!" : "Subscribe"}
          </button>
        </form>

        <p className="mt-4 text-[.7rem] text-[var(--text-4)]">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
