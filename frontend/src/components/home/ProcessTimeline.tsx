export function ProcessTimeline() {
  return (
    <section className="process" id="process">
      <div className="container">
        <div className="section-top center">
          <span className="overline anim-up">HOW WE CRAFT</span>
          <h2 className="section-title anim-up">From Source to <em>Bottle</em></h2>
          <p className="section-sub anim-up">Every RYVEN fragrance goes through a meticulous 4-step process to ensure lasting quality.</p>
        </div>
        <div className="process-timeline">
          <div className="process-step anim-up">
            <span className="process-num">01</span>
            <div className="process-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>Source</h3>
            <p>We import premium fragrance oils from Grasse, France and other renowned perfumery regions.</p>
          </div>
          <div className="process-step anim-up">
            <span className="process-num">02</span>
            <div className="process-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <h3>Blend</h3>
            <p>Our master perfumers craft each scent by hand, balancing top, heart and base notes.</p>
          </div>
          <div className="process-step anim-up">
            <span className="process-num">03</span>
            <div className="process-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3>Age</h3>
            <p>Each batch is aged for 3&#x2013;6 weeks, allowing the notes to mature and deepen in complexity.</p>
          </div>
          <div className="process-step anim-up">
            <span className="process-num">04</span>
            <div className="process-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M8 2h8l4 10H4L8 2z"/><path d="M12 12v10"/><path d="M8 22h8"/></svg>
            </div>
            <h3>Bottle</h3>
            <p>Hand-filled into weighted glass bottles with precision atomizers for the perfect spray.</p>
          </div>
          <div className="process-line"></div>
        </div>
      </div>
    </section>
  );
}
