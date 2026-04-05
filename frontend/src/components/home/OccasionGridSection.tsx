import Link from "next/link";

export function OccasionGridSection() {
  return (
    <section className="occasion" id="occasion">
      <div className="container">
        <div className="section-top center">
          <span className="overline anim-up">SHOP BY OCCASION</span>
          <h2 className="section-title anim-up">Where Will You <em>Wear</em> It?</h2>
          <p className="section-sub anim-up">Every occasion deserves its own scent. Find the fragrance that matches your moment.</p>
        </div>
        <div className="occasion-grid">
          <Link href="/collections/date-night" className="occasion-card anim-up">
            <img src="https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=600&q=80" alt="Date Night" loading="lazy" />
            <div className="occasion-overlay">
              <h3>Date Night</h3>
              <span>12 Products <span className="occasion-arrow">&rarr;</span></span>
            </div>
          </Link>
          <Link href="/collections/office-ready" className="occasion-card anim-up">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" alt="Office Power" loading="lazy" />
            <div className="occasion-overlay">
              <h3>Office Power</h3>
              <span>9 Products <span className="occasion-arrow">&rarr;</span></span>
            </div>
          </Link>
          <Link href="/collections/wedding-season" className="occasion-card anim-up">
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" alt="Wedding Season" loading="lazy" />
            <div className="occasion-overlay">
              <h3>Wedding Season</h3>
              <span>8 Products <span className="occasion-arrow">&rarr;</span></span>
            </div>
          </Link>
          <Link href="/collections/weekend-vibes" className="occasion-card anim-up">
            <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80" alt="Weekend Vibes" loading="lazy" />
            <div className="occasion-overlay">
              <h3>Weekend Vibes</h3>
              <span>14 Products <span className="occasion-arrow">&rarr;</span></span>
            </div>
          </Link>
          <Link href="/collections/gifting" className="occasion-card anim-up">
            <img src="https://images.unsplash.com/photo-1549465220-1a8b9238f8e1?auto=format&fit=crop&w=600&q=80" alt="Gifting" loading="lazy" />
            <div className="occasion-overlay">
              <h3>Gifting</h3>
              <span>18 Products <span className="occasion-arrow">&rarr;</span></span>
            </div>
          </Link>
          <Link href="/collections/travel-ready" className="occasion-card anim-up">
            <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80" alt="Travel Ready" loading="lazy" />
            <div className="occasion-overlay">
              <h3>Travel Ready</h3>
              <span>6 Products <span className="occasion-arrow">&rarr;</span></span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
