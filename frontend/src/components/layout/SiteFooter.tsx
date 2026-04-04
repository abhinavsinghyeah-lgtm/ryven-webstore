import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--accent)] text-white">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--px)] py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold tracking-[.12em]">RYVEN</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Modern fragrances crafted for the bold. Clean ingredients, long-lasting formulas, made in India.
            </p>
          </div>
          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[.15em] text-white/40 mb-4">Shop</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/products" className="text-sm text-white/70 hover:text-white transition-colors">All Fragrances</Link>
              <Link href="/products" className="text-sm text-white/70 hover:text-white transition-colors">New Arrivals</Link>
              <Link href="/products" className="text-sm text-white/70 hover:text-white transition-colors">Best Sellers</Link>
              <Link href="/products" className="text-sm text-white/70 hover:text-white transition-colors">Gift Sets</Link>
            </div>
          </div>
          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[.15em] text-white/40 mb-4">Company</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">Our Story</Link>
              <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">Ingredients</Link>
              <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">Sustainability</Link>
              <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">Careers</Link>
            </div>
          </div>
          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[.15em] text-white/40 mb-4">Support</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">Contact Us</Link>
              <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">Shipping Info</Link>
              <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">Returns</Link>
              <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} RYVEN PERFUMES. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/about" className="text-xs text-white/40 hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/about" className="text-xs text-white/40 hover:text-white/70 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
