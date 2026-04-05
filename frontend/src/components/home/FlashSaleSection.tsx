"use client";

import { useState, useEffect } from "react";

export function FlashSaleSection() {
  const [hours, setHours] = useState(14);
  const [mins, setMins] = useState(36);
  const [secs, setSecs] = useState(8);

  useEffect(() => {
    let total = hours * 3600 + mins * 60 + secs;
    const interval = setInterval(() => {
      if (total <= 0) { clearInterval(interval); return; }
      total--;
      setHours(Math.floor(total / 3600));
      setMins(Math.floor((total % 3600) / 60));
      setSecs(total % 60);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="flash-sale">
      <div className="container">
        <div className="flash-inner anim-up">
          <div className="flash-content">
            <span className="flash-badge">&#x26A1; -40% LIMITED TIME</span>
            <h2>Flash Sale &mdash; Signature Collection</h2>
            <p>Our best-selling set at the lowest price ever. Includes 3 premium fragrances in a luxury gift box.</p>
            <div className="flash-timer">
              <div className="timer-block"><span>{pad(hours)}</span><small>Hours</small></div>
              <span className="timer-sep">:</span>
              <div className="timer-block"><span>{pad(mins)}</span><small>Mins</small></div>
              <span className="timer-sep">:</span>
              <div className="timer-block"><span>{pad(secs)}</span><small>Secs</small></div>
            </div>
            <div className="flash-prices">
              <span className="flash-original">&#x20B9;5,999</span>
              <span className="flash-now">&#x20B9;3,599</span>
              <span className="flash-save">Save &#x20B9;2,400</span>
            </div>
            <span className="flash-scarcity">&#x1F525; Only 23 sets left</span>
            <a href="#" className="btn btn-white">Grab This Deal</a>
          </div>
          <div className="flash-visual">
            <img src="https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=800&q=80" alt="Signature Collection Set" loading="lazy" />
            <span className="flash-percent">-40%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
