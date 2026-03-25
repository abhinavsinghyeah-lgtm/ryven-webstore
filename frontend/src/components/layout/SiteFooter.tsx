import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-300 bg-[#f0efed] px-5 py-12 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-3xl font-bold text-neutral-900">RYVEN</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">Modern Perfume House</p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
          <Link href="/products" className="hover:text-neutral-900 transition-colors">Catalog</Link>
          <Link href="/about" className="hover:text-neutral-900 transition-colors">About</Link>
          <Link href="/login" className="hover:text-neutral-900 transition-colors">Account</Link>
          <Link href="/cart" className="hover:text-neutral-900 transition-colors">Cart</Link>
        </div>

        <p className="text-xs text-neutral-400">© {new Date().getFullYear()} RYVEN. All rights reserved.</p>
      </div>
    </footer>
  );
}
