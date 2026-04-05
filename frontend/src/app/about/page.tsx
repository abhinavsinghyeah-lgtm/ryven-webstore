import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About RYVEN",
  description:
    "Learn about RYVEN's perfume philosophy, ingredient sourcing, and our story of building modern fragrances for youth culture.",
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="wrapper">
        {/* Hero */}
        <div className="about-hero">
          <div className="about-hero-content">
            <p className="overline">Our Story</p>
            <h1>Crafted for a generation that moves fast.</h1>
            <p>
              RYVEN was built to make contemporary perfumery feel personal again.
              We obsess over scent architecture, skin behaviour in Indian weather,
              and packaging that feels elevated without shouting for attention.
            </p>
            <p>
              The goal is simple: signature fragrances that people remember, prices
              that still make sense, and an online shopping experience that is
              direct, beautiful, and trustworthy.
            </p>
            <div className="about-hero-btns">
              <Link href="/products" className="btn btn--primary">Explore Catalog</Link>
              <Link href="/signup" className="btn btn--outline">Join RYVEN</Link>
            </div>
          </div>
          <div className="about-hero-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1400&auto=format&fit=crop"
              alt="RYVEN studio fragrance composition"
            />
          </div>
        </div>

        {/* Values */}
        <div className="about-values">
          <div className="about-value">
            <div className="about-value-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
            </div>
            <h3>Modern Perfumery</h3>
            <p>We design clean, expressive fragrances made for daily movement and real city life &#x2014; not just occasion wear.</p>
          </div>
          <div className="about-value">
            <div className="about-value-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <h3>Better Ingredients</h3>
            <p>From neroli and tea accords to woods and musks &#x2014; we blend high-impact notes with skin-friendly longevity.</p>
          </div>
          <div className="about-value">
            <div className="about-value-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M16 8l-8 8M8 8l8 8" /></svg>
            </div>
            <h3>Transparent Pricing</h3>
            <p>No inflated luxury markups. You pay for fragrance quality, not for heavy retail overhead.</p>
          </div>
        </div>

        {/* Story / Numbers */}
        <div className="about-story">
          <p className="overline">The Numbers</p>
          <h2>Built different, priced fair</h2>
          <p>Every bottle goes through months of development, testing across climates,
            and feedback from real people before it ships.</p>
          <div className="about-numbers">
            <div className="about-number">
              <strong>50+</strong>
              <span>Scent Iterations</span>
            </div>
            <div className="about-number">
              <strong>8&#x2013;12hr</strong>
              <span>Avg. Longevity</span>
            </div>
            <div className="about-number">
              <strong>100%</strong>
              <span>Cruelty Free</span>
            </div>
            <div className="about-number">
              <strong>&#x20B9;499</strong>
              <span>Starting Price</span>
            </div>
          </div>
        </div>

        {/* Promise cards */}
        <div className="about-promise">
          <div className="about-promise-card">
            <div className="about-promise-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M9 12l2 2 4-4" /></svg>
            </div>
            <div>
              <h3>Quality Guaranteed</h3>
              <p>Every product undergoes rigorous quality checks before it leaves our facility.</p>
            </div>
          </div>
          <div className="about-promise-card">
            <div className="about-promise-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
            </div>
            <div>
              <h3>Fast Shipping</h3>
              <p>Pan-India delivery in 3&#x2013;5 business days. Your fragrance arrives safe, sealed, and on time.</p>
            </div>
          </div>
          <div className="about-promise-card">
            <div className="about-promise-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div>
              <h3>Secure Payments</h3>
              <p>Razorpay-powered checkout with full encryption. UPI, cards, netbanking supported.</p>
            </div>
          </div>
          <div className="about-promise-card">
            <div className="about-promise-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" /></svg>
            </div>
            <div>
              <h3>Real Support</h3>
              <p>Have a question? Our team replies within hours, not days. Real people, real answers.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
