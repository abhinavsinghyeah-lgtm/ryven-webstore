import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#060708] px-5 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-3xl text-white">RYVEN</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">Modern Perfume House</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-white/70">
          <Link href="/products" className="hover:text-white">Catalog</Link>
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/login" className="hover:text-white">Account</Link>
          <Link href="/cart" className="hover:text-white">Cart</Link>
        </div>

        <p className="text-xs text-white/40">© {new Date().getFullYear()} RYVEN. All rights reserved.</p>
      </div>
    </footer>
  );
}
