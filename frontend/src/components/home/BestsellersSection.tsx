export function BestsellersSection() {
  return (
    <section className="highlight" id="bestsellers">
      <div className="container">
        <div className="section-top center">
          <span className="overline anim-up">CUSTOMER FAVOURITES</span>
          <h2 className="section-title anim-up">Our Best <em>Sellers</em></h2>
          <p className="section-sub anim-up">The fragrances our customers can&apos;t stop buying. Deep-dive into what makes each one special.</p>
        </div>

        {/* Noir Velvet */}
        <div className="highlight-card anim-up">
          <div className="highlight-img">
            <img src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80" alt="Noir Velvet" loading="lazy" />
            <span className="highlight-rank">#1</span>
          </div>
          <div className="highlight-info">
            <div className="highlight-badges">
              <span className="badge-hot">&#x1F525; 1,240 sold this month</span>
              <span className="badge-rating">&#x2605; 4.9 (2,340 reviews)</span>
            </div>
            <h3>Noir Velvet</h3>
            <p>The one that started it all. Dark, warm, and addictive &mdash; for people who want to be remembered. Black orchid meets smoky oud, softened with a touch of vanilla.</p>
            <div className="highlight-details">
              <div className="highlight-note"><small>Top</small><span>Black Pepper, Bergamot</span></div>
              <div className="highlight-note"><small>Heart</small><span>Black Orchid, Oud</span></div>
              <div className="highlight-note"><small>Base</small><span>Dark Vanilla, Musk</span></div>
            </div>
            <div className="highlight-longevity">
              <span>Longevity</span>
              <div className="longevity-bar"><div className="longevity-fill" style={{ "--w": "92%" } as React.CSSProperties}></div></div>
              <span>14 hrs</span>
            </div>
            <div className="highlight-action">
              <div>
                <span className="highlight-price">&#x20B9;3,749</span>
                <span className="highlight-price-old">&#x20B9;4,999</span>
              </div>
              <a href="/products" className="btn btn-dark">Add to Cart</a>
            </div>
          </div>
        </div>

        {/* Rose Absolue */}
        <div className="highlight-card highlight-card-reverse anim-up">
          <div className="highlight-img">
            <img src="https://images.unsplash.com/photo-1594035910387-fea081e66b42?auto=format&fit=crop&w=800&q=80" alt="Rose Absolue" loading="lazy" />
            <span className="highlight-rank">#2</span>
          </div>
          <div className="highlight-info">
            <div className="highlight-badges">
              <span className="badge-hot">&#x1F525; 890 sold this month</span>
              <span className="badge-rating">&#x2605; 4.8 (890 reviews)</span>
            </div>
            <h3>Rose Absolue</h3>
            <p>Elegant without trying. A modern rose fragrance that feels fresh, not grandma&apos;s dresser. Damask rose wrapped in silky peony and settled into soft white musk.</p>
            <div className="highlight-details">
              <div className="highlight-note"><small>Top</small><span>Pink Pepper, Lychee</span></div>
              <div className="highlight-note"><small>Heart</small><span>Damask Rose, Peony</span></div>
              <div className="highlight-note"><small>Base</small><span>White Musk, Cedarwood</span></div>
            </div>
            <div className="highlight-longevity">
              <span>Longevity</span>
              <div className="longevity-bar"><div className="longevity-fill" style={{ "--w": "85%" } as React.CSSProperties}></div></div>
              <span>12 hrs</span>
            </div>
            <div className="highlight-action">
              <div>
                <span className="highlight-price">&#x20B9;2,999</span>
              </div>
              <a href="/products" className="btn btn-dark">Add to Cart</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
