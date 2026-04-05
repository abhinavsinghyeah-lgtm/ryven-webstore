export function NotesExplorer() {
  return (
    <section className="notes-explorer">
      <div className="container">
        <div className="section-top center">
          <span className="overline anim-up">FRAGRANCE FAMILIES</span>
          <h2 className="section-title anim-up">Explore by <em>Notes</em></h2>
          <p className="section-sub anim-up">Discover the note families that define each RYVEN fragrance.</p>
        </div>
        <div className="notes-grid">
          <a href="#shop" className="note-card anim-up">
            <div className="note-visual"><span className="note-emoji">&#x1FAB5;</span></div>
            <h3>Woody</h3>
            <p>Cedar, Sandalwood, Oud</p>
            <span className="note-count">18 fragrances</span>
          </a>
          <a href="#shop" className="note-card anim-up">
            <div className="note-visual"><span className="note-emoji">&#x1F339;</span></div>
            <h3>Floral</h3>
            <p>Rose, Jasmine, Peony</p>
            <span className="note-count">12 fragrances</span>
          </a>
          <a href="#shop" className="note-card anim-up">
            <div className="note-visual"><span className="note-emoji">&#x1F525;</span></div>
            <h3>Oriental</h3>
            <p>Amber, Saffron, Incense</p>
            <span className="note-count">14 fragrances</span>
          </a>
          <a href="#shop" className="note-card anim-up">
            <div className="note-visual"><span className="note-emoji">&#x1F33F;</span></div>
            <h3>Fresh</h3>
            <p>Bergamot, Mint, Green Tea</p>
            <span className="note-count">10 fragrances</span>
          </a>
          <a href="#shop" className="note-card anim-up">
            <div className="note-visual"><span className="note-emoji">&#x1F30A;</span></div>
            <h3>Aquatic</h3>
            <p>Sea Salt, Marine, Ozone</p>
            <span className="note-count">8 fragrances</span>
          </a>
          <a href="#shop" className="note-card anim-up">
            <div className="note-visual"><span className="note-emoji">&#x1F34A;</span></div>
            <h3>Citrus</h3>
            <p>Lemon, Grapefruit, Neroli</p>
            <span className="note-count">9 fragrances</span>
          </a>
        </div>
      </div>
    </section>
  );
}
