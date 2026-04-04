import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">RYVEN</Link>
            <p>Premium fragrances crafted for the modern individual. Every scent tells a story.</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2 29 29 0 0 0-.46 5.25 29 29 0 0 0 .46 5.25 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.25z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link href="/products">All Fragrances</Link></li>
              <li><Link href="/products?category=bestsellers">Bestsellers</Link></li>
              <li><Link href="/products?category=new">New Arrivals</Link></li>
              <li><a href="#">Gift Sets</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>About</h4>
            <ul>
              <li><a href="#process">Our Process</a></li>
              <li><a href="#">Ingredients</a></li>
              <li><a href="#">Sustainability</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Track Order</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RYVEN PERFUMES. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
