"use client";
import { useEffect, useRef } from "react";

export function FlashSaleSection() {
  const hRef = useRef<HTMLSpanElement>(null);
  const mRef = useRef<HTMLSpanElement>(null);
  const sRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const end = Date.now() + 14 * 3600000 + 36 * 60000;
    const tick = () => {
      const d = Math.max(0, end - Date.now());
      if (hRef.current) hRef.current.textContent = String(Math.floor(d / 3600000)).padStart(2, "0");
      if (mRef.current) mRef.current.textContent = String(Math.floor((d % 3600000) / 60000)).padStart(2, "0");
      if (sRef.current) sRef.current.textContent = String(Math.floor((d % 60000) / 1000)).padStart(2, "0");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="flash-sale">
      <div className="container">
        <div className="flash-inner">
          <div className="flash-content">
            <span className="flash-badge">&#x26A1; -40% LIMITED TIME</span>
            <h2>Discovery Set<br /><em>6 Bestsellers</em></h2>
            <p>Try our top 6 fragrances in elegant 10ml travel sprays. The perfect way to find your signature scent.</p>
            <div className="flash-timer">
              <div className="flash-timer-block">
                <span ref={hRef}>14</span>
                <small>hrs</small>
              </div>
              <div className="flash-timer-block">
                <span ref={mRef}>36</span>
                <small>min</small>
              </div>
              <div className="flash-timer-block">
                <span ref={sRef}>00</span>
                <small>sec</small>
              </div>
            </div>
            <div className="flash-prices">
              <span className="flash-price-old">&#x20B9;5,999</span>
              <span className="flash-price-new">&#x20B9;3,599</span>
            </div>
            <a href="/products" className="btn btn-dark">Grab the Deal &#x2192;</a>
            <small className="flash-scarcity">&#x1F525; Only 23 sets left at this price</small>
          </div>
          <div className="flash-visual">
            <img src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=600&q=80" alt="Discovery Set" />
            <span className="flash-visual-badge">-40%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
