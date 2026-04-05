export function GuaranteesSection() {
  return (
    <section className="guarantees">
      <div className="container">
        <div className="guarantees-grid">
          <div className="guarantee-item anim-up">
            <div className="guarantee-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12l5 5L20 7" /></svg>
            </div>
            <strong>100% Authentic</strong>
            <p>Premium ingredients, no dupes</p>
          </div>
          <div className="guarantee-item anim-up">
            <div className="guarantee-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <strong>Secure Checkout</strong>
            <p>SSL encrypted payments</p>
          </div>
          <div className="guarantee-item anim-up">
            <div className="guarantee-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
            </div>
            <strong>Free Shipping</strong>
            <p>On orders above &#x20B9;999</p>
          </div>
          <div className="guarantee-item anim-up">
            <div className="guarantee-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
            </div>
            <strong>Easy Returns</strong>
            <p>7-day hassle-free returns</p>
          </div>
        </div>
      </div>
    </section>
  );
}
