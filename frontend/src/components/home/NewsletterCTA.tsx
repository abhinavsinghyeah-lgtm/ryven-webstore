"use client";
import { useState, type FormEvent } from "react";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email) {
      alert("Thanks! Check your inbox for your 10% off code.");
      setEmail("");
    }
  }

  return (
    <section className="cta">
      <div className="container">
        <div className="cta-box anim-up">
          <span className="overline" style={{ color: "rgba(255,255,255,.6)" }}>EXCLUSIVE ACCESS</span>
          <h2>Get 10% Off Your <em>First Order</em></h2>
          <p>Plus early access to new launches, restocks, and members-only deals. No spam, just scents.</p>
          <form className="cta-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-dark">Subscribe</button>
          </form>
          <small>Join 8,000+ fragrance lovers &#xB7; Unsubscribe anytime</small>
        </div>
      </div>
    </section>
  );
}
