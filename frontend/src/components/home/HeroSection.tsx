export function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-badge anim-up">
            <span className="pulse-dot"></span>
            <span>3,240 people shopping right now</span>
          </div>
          <h1 className="hero-title anim-up">Find Your<br />Signature <em>Scent.</em></h1>
          <p className="hero-sub anim-up">Clean, bold, long-lasting fragrances crafted in India. Inspired by the world&apos;s most iconic perfumes &mdash; without the luxury markup.</p>
          <div className="hero-btns anim-up">
            <a href="#shop" className="btn btn-dark btn-lg">Shop Now <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></a>
            <a href="#process" className="btn btn-outline">Our Process</a>
          </div>
          <div className="hero-stats anim-up">
            <div className="hero-stat">
              <strong>50+</strong>
              <span>Fragrances</span>
            </div>
            <span className="hero-stat-sep"></span>
            <div className="hero-stat">
              <strong>12,000+</strong>
              <span>Happy Customers</span>
            </div>
            <span className="hero-stat-sep"></span>
            <div className="hero-stat">
              <strong>4.9&#x2605;</strong>
              <span>Avg Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-visual anim-up">
          <div className="hero-img-wrap">
            <img src="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80" alt="RYVEN Fragrance Collection" />
          </div>
          <div className="hero-float-card float-card-1">
            <strong>Just sold</strong>
            <small>Noir Velvet &mdash; 12s ago</small>
          </div>
          <div className="hero-float-card float-card-2">
            <span className="float-stars">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</span>
            <small>&ldquo;Best perfume under &#x20B9;5K&rdquo;</small>
          </div>
        </div>
      </div>
    </section>
  );
}
