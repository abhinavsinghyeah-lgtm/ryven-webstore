import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 px-5 py-12 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">RYVEN</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">Modern Perfume House</p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
          <Link href="/products" className="hover:text-pink-500 transition-colors">Catalog</Link>
          <Link href="/about" className="hover:text-purple-500 transition-colors">About</Link>
          <Link href="/login" className="hover:text-blue-500 transition-colors">Account</Link>
          <Link href="/cart" className="hover:text-pink-500 transition-colors">Cart</Link>
        </div>

        <p className="text-xs text-neutral-400">© {new Date().getFullYear()} RYVEN. All rights reserved.</p>
      </div>
    </footer>
  );
}
