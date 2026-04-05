"use client";

import { FormEvent, useState } from "react";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section className="cta">
      <div className="container">
        <div className="cta-box">
          <div className="cta-content">
            <h2>Get 10% Off Your <em>First Order</em></h2>
            <p>Join 12,000+ fragrance lovers. Get exclusive drops, sale alerts, and insider tips.</p>
          </div>
          <form className="cta-form" onSubmit={handleSubmit}>
            <input type="email" placeholder="your@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="btn btn-white">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
}
