const reviews = [
  { name: "Rahul M.", city: "Mumbai", rating: 5, date: "2 weeks ago", text: "Noir Velvet is INSANE. Got more compliments in one week than I did all last year. My girlfriend keeps stealing it.", product: "Noir Velvet", verified: true },
  { name: "Priya S.", city: "Delhi", rating: 5, date: "1 month ago", text: "Rose Absolue is my everyday scent now. Lasts from morning meeting to dinner date. Worth every rupee.", product: "Rose Absolue", verified: true },
  { name: "Ananya K.", city: "Bangalore", rating: 5, date: "3 weeks ago", text: "Took the quiz and got matched with Amber Eclipse. It\u0027s literally perfect for me. The longevity is unreal.", product: "Amber Eclipse", verified: true },
  { name: "Dev P.", city: "Pune", rating: 4, date: "1 week ago", text: "Oud Royale is sophisticated and long-lasting. The projection could be a bit more for the price, but the scent itself is 10/10.", product: "Oud Royale", verified: true },
];

const bars = [
  { stars: 5, pct: 82 },
  { stars: 4, pct: 12 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

export function ReviewsSection() {
  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div className="section-top center">
          <span className="overline anim-up">REAL REVIEWS</span>
          <h2 className="section-title anim-up">What Our Customers <em>Say</em></h2>
        </div>

        <div className="reviews-summary anim-up">
          <div className="reviews-big-rating">
            <span className="big-num">4.9</span>
            <div>
              <div className="stars-row">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
              <small>Based on 4,280+ reviews</small>
            </div>
          </div>
          <div className="reviews-bars">
            {bars.map((b) => (
              <div className="review-bar-row" key={b.stars}>
                <span>{b.stars}&#x2605;</span>
                <div className="review-bar"><div className="review-bar-fill" style={{ "--w": `${b.pct}%` } as React.CSSProperties}></div></div>
                <span>{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-grid">
          {reviews.map((r, i) => (
            <div className="review-card anim-up" key={i}>
              <div className="review-header">
                <div className="review-avatar">{r.name.charAt(0)}</div>
                <div>
                  <strong>{r.name}</strong>
                  <small>{r.city} &#xB7; {r.date}</small>
                </div>
                {r.verified && <span className="verified-badge">&#x2713; Verified</span>}
              </div>
              <div className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
              <p>{r.text}</p>
              <small className="review-product">Purchased: {r.product}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
