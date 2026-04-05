import Link from "next/link";

import { CartPanel } from "@/components/cart/CartPanel";

export default function CartPage() {
  return (
    <section className="cart-page">
      <div className="container">
        <Link href="/products" className="cart-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          Continue Shopping
        </Link>
        <div className="cart-header">
          <h1>Your Cart</h1>
          <p>Review your items and checkout when you&apos;re ready.</p>
        </div>
        <CartPanel />
      </div>
    </section>
  );
}
