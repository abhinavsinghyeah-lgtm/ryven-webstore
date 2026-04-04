const occasions = [
  { title: "Date Night", img: "photo-1511285560929-80b456fea0bc", link: "/products?occasion=date-night" },
  { title: "Office Power", img: "photo-1507003211169-0a1dd7228f2d", link: "/products?occasion=office" },
  { title: "Wedding Season", img: "photo-1519741497674-611481863552", link: "/products?occasion=wedding" },
  { title: "Weekend Vibes", img: "photo-1506794778202-cad84cf45f1d", link: "/products?occasion=weekend" },
  { title: "Gifting", img: "photo-1513884923967-4b182ef167ab", link: "/products?occasion=gifting" },
  { title: "Travel Ready", img: "photo-1488646953014-85cb44e25828", link: "/products?occasion=travel" },
];

export function OccasionGridSection() {
  return (
    <section className="occasion" id="occasions">
      <div className="container">
        <div className="section-top center">
          <span className="overline anim-up">SHOP BY OCCASION</span>
          <h2 className="section-title anim-up">Find Your <em>Moment</em></h2>
          <p className="section-sub anim-up">Every occasion deserves its own signature scent. Where are you headed?</p>
        </div>
        <div className="occasion-grid">
          {occasions.map((o) => (
            <a href={o.link} className="occasion-card anim-up" key={o.title}>
              <img src={`https://images.unsplash.com/${o.img}?auto=format&fit=crop&w=600&q=80`} alt={o.title} loading="lazy" />
              <div className="occasion-overlay">
                <h3>{o.title}</h3>
                <span className="occasion-arrow">&#x2192;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
