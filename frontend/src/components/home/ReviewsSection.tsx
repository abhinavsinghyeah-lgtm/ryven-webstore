import React from "react";

export function ReviewsSection() {
  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div className="section-top center">
          <span className="overline anim-up">WHAT PEOPLE SAY</span>
          <h2 className="section-title anim-up">12,000+ Happy <em>Customers</em></h2>
          <p className="section-sub anim-up">Real reviews from real people. No filters, no fakes.</p>
        </div>
        <div className="reviews-summary anim-up">
          <div className="review-big-rating">
            <strong>4.9</strong>
            <div className="review-big-stars">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
            <span>Based on 4,820 reviews</span>
          </div>
          <div className="review-bars">
            <div className="review-bar-row">
              <span>5&#x2605;</span>
              <div className="review-bar"><div className="review-bar-fill" style={{ "--w": "82%" } as React.CSSProperties}></div></div>
              <span>82%</span>
            </div>
            <div className="review-bar-row">
              <span>4&#x2605;</span>
              <div className="review-bar"><div className="review-bar-fill" style={{ "--w": "12%" } as React.CSSProperties}></div></div>
              <span>12%</span>
            </div>
            <div className="review-bar-row">
              <span>3&#x2605;</span>
              <div className="review-bar"><div className="review-bar-fill" style={{ "--w": "4%" } as React.CSSProperties}></div></div>
              <span>4%</span>
            </div>
            <div className="review-bar-row">
              <span>2&#x2605;</span>
              <div className="review-bar"><div className="review-bar-fill" style={{ "--w": "1%" } as React.CSSProperties}></div></div>
              <span>1%</span>
            </div>
            <div className="review-bar-row">
              <span>1&#x2605;</span>
              <div className="review-bar"><div className="review-bar-fill" style={{ "--w": "1%" } as React.CSSProperties}></div></div>
              <span>1%</span>
            </div>
          </div>
        </div>
        <div className="reviews-grid">
          <div className="review-card anim-up">
            <div className="review-stars">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
            <h4>&ldquo;Better than the original&rdquo;</h4>
            <p>Bought Noir Velvet as an alternative to Tom Ford &mdash; honestly it lasts longer. My wife thought I was wearing the real thing. At this price? No brainer.</p>
            <div className="review-bottom">
              <div className="review-author">
                <span className="review-avatar">R</span>
                <div>
                  <strong>Rahul M.</strong>
                  <small>Mumbai &middot; Verified Buyer</small>
                </div>
              </div>
              <span className="review-helpful">&#x1F44D; 124 helpful</span>
            </div>
          </div>
          <div className="review-card anim-up">
            <div className="review-stars">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
            <h4>&ldquo;Compliment magnet&rdquo;</h4>
            <p>I wear Rose Absolue to work and I get asked about my perfume at least twice a week. The sillage is incredible for the price. Already ordered my second bottle.</p>
            <div className="review-bottom">
              <div className="review-author">
                <span className="review-avatar">P</span>
                <div>
                  <strong>Priya S.</strong>
                  <small>Delhi &middot; Verified Buyer</small>
                </div>
              </div>
              <span className="review-helpful">&#x1F44D; 89 helpful</span>
            </div>
          </div>
          <div className="review-card anim-up">
            <div className="review-stars">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
            <h4>&ldquo;Gift that impressed&rdquo;</h4>
            <p>Got the Signature Collection as a gift for my husband. The packaging felt premium, the scents are amazing. Oud Royale is his new signature. Worth every rupee.</p>
            <div className="review-bottom">
              <div className="review-author">
                <span className="review-avatar">A</span>
                <div>
                  <strong>Ananya K.</strong>
                  <small>Bangalore &middot; Verified Buyer</small>
                </div>
              </div>
              <span className="review-helpful">&#x1F44D; 67 helpful</span>
            </div>
          </div>
          <div className="review-card anim-up">
            <div className="review-stars">&#x2605;&#x2605;&#x2605;&#x2605;&#x2606;</div>
            <h4>&ldquo;Lasts all day long&rdquo;</h4>
            <p>Midnight Saffron is incredible &mdash; sprayed at 8am and still getting whiffs at 10pm. Only giving 4 stars because I wish there were more size options. But the quality? 10/10.</p>
            <div className="review-bottom">
              <div className="review-author">
                <span className="review-avatar">D</span>
                <div>
                  <strong>Dev P.</strong>
                  <small>Pune &middot; Verified Buyer</small>
                </div>
              </div>
              <span className="review-helpful">&#x1F44D; 52 helpful</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
