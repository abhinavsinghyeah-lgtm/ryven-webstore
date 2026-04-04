const notes = [
  { family: "Woody", emoji: "\uD83E\uDEB5", count: 14, desc: "Warm, grounding, sophisticated" },
  { family: "Floral", emoji: "\uD83C\uDF39", count: 11, desc: "Elegant, romantic, timeless" },
  { family: "Oriental", emoji: "\uD83D\uDD25", count: 9, desc: "Rich, spicy, mysterious" },
  { family: "Fresh", emoji: "\uD83C\uDF3F", count: 12, desc: "Clean, crisp, energizing" },
  { family: "Aquatic", emoji: "\uD83C\uDF0A", count: 7, desc: "Cool, oceanic, breezy" },
  { family: "Citrus", emoji: "\uD83C\uDF4A", count: 8, desc: "Bright, zesty, uplifting" },
];

export function NotesExplorer() {
  return (
    <section className="notes-explorer">
      <div className="container">
        <div className="section-top center">
          <span className="overline anim-up">EXPLORE BY NOTES</span>
          <h2 className="section-title anim-up">Find Your <em>Note Family</em></h2>
          <p className="section-sub anim-up">Not sure what you like? Start with a note family and discover fragrances that match your vibe.</p>
        </div>
        <div className="notes-grid">
          {notes.map((n) => (
            <a href={`/products?notes=${n.family.toLowerCase()}`} className="note-card anim-up" key={n.family}>
              <div className="note-visual">
                <span className="note-emoji">{n.emoji}</span>
              </div>
              <h3>{n.family}</h3>
              <p>{n.desc}</p>
              <span className="note-count">{n.count} fragrances</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
