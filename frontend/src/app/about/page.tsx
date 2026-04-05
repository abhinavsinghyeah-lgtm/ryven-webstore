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
              RYVEN was born from a simple frustration: why does good perfume have to cost
              a fortune? We set out to change that. Our studio blends high-grade
              ingredients sourced from Grasse, Kannauj, and beyond &#x2014; then ships
              them directly to you, cutting out every middleman.
            </p>
            <p>
              We obsess over scent architecture, skin behaviour in Indian weather,
              and packaging that feels elevated without shouting for attention.
              The result? Signature fragrances people remember, at prices that
              actually make sense.
            </p>
            <div className="about-hero-btns">
              <Link href="/products" className="btn btn-dark">Explore Catalog</Link>
              <Link href="/collections" className="btn btn-outline">Browse Collections</Link>
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
            <p>Clean, expressive fragrances designed for daily movement and real city life &#x2014; not just occasion wear. Every scent tells a story.</p>
          </div>
          <div className="about-value">
            <div className="about-value-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <h3>Premium Ingredients</h3>
            <p>Neroli, oud, tea accords, rare woods and artisan musks. We source globally and blend locally for unmatched quality at every price point.</p>
          </div>
          <div className="about-value">
            <div className="about-value-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
            </div>
            <h3>Transparent Pricing</h3>
            <p>Zero inflated luxury markups. You pay for fragrance quality, not retail overhead or celebrity endorsements. Fair price, always.</p>
          </div>
        </div>

        {/* Story / Numbers */}
        <div className="about-story">
          <p className="overline">The Numbers</p>
          <h2>Built different, priced fair</h2>
          <p>Every bottle goes through months of development &#x2014; tested across climates,
            refined through real feedback, and perfected before it ships.</p>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
            </div>
            <div>
              <h3>Quality Guaranteed</h3>
              <p>Every product undergoes rigorous quality checks. Not satisfied? We&#x2019;ll make it right, no questions asked.</p>
            </div>
          </div>
          <div className="about-promise-card">
            <div className="about-promise-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
            </div>
            <div>
              <h3>Fast Pan-India Shipping</h3>
              <p>3&#x2013;5 business days delivery across India. Your fragrance arrives safe, sealed, and beautifully packaged.</p>
            </div>
          </div>
          <div className="about-promise-card">
            <div className="about-promise-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div>
              <h3>Secure Payments</h3>
              <p>Razorpay-powered checkout with full encryption. UPI, cards, wallets, and net banking all supported.</p>
            </div>
          </div>
          <div className="about-promise-card">
            <div className="about-promise-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" /></svg>
            </div>
            <div>
              <h3>Real Human Support</h3>
              <p>Have a question? Our team replies within hours, not days. Real people giving real answers &#x2014; always.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
