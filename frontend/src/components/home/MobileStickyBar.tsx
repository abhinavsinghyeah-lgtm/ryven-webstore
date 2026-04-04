"use client";

export function MobileStickyBar() {
  return (
    <div className="mobile-sticky-bar" id="mobileSticky">
      <div className="mobile-sticky-inner">
        <div className="mobile-sticky-price">
          <strong>From &#x20B9;1,499</strong>
          <small>25% OFF today</small>
        </div>
        <a href="/products" className="btn btn-dark">Shop Now</a>
      </div>
    </div>
  );
}
