"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/contexts/CartContext";
import { formatPricePaise } from "@/lib/format";

const fallbackImage =
  "https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1200&auto=format&fit=crop";

export function CartPanel() {
  const { cart, isReady, updateQuantity, removeFromCart } = useCart();

  /* ---- Loading skeleton ---- */
  if (!isReady) {
    return (
      <div className="cart-layout">
        <div className="cart-items">
          {[1, 2, 3].map((i) => (
            <div key={i} className="cart-skeleton">
              <div className="skeleton-pulse" style={{ width: 110, height: 140 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="skeleton-pulse" style={{ height: 18, width: "60%" }} />
                <div className="skeleton-pulse" style={{ height: 14, width: "40%" }} />
                <div style={{ marginTop: "auto" }}>
                  <div className="skeleton-pulse" style={{ height: 36, width: 120 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-skeleton" style={{ flexDirection: "column", gap: 14, padding: 28 }}>
          <div className="skeleton-pulse" style={{ height: 14, width: "50%" }} />
          <div className="skeleton-pulse" style={{ height: 14, width: "100%" }} />
          <div className="skeleton-pulse" style={{ height: 14, width: "100%" }} />
          <div className="skeleton-pulse" style={{ height: 48, width: "100%", marginTop: 8 }} />
        </div>
      </div>
    );
  }

  /* ---- Empty cart ---- */
  if (!cart.items.length) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-3)" }}>
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven&apos;t added any fragrances yet. Explore our collection and find your signature scent.</p>
        <Link href="/products" className="btn btn-dark">Browse Products</Link>
      </div>
    );
  }

  /* ---- Cart with items ---- */
  return (
    <div className="cart-layout">
      {/* Items */}
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.productId} className="cart-item">
            <div className="cart-item-img">
              <Image
                src={item.product.imageUrl || fallbackImage}
                alt={item.product.name}
                width={110}
                height={140}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="cart-item-body">
              <div className="cart-item-top">
                <div>
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-variant">{formatPricePaise(item.product.pricePaise, item.product.currency)} each</div>
                </div>
                <button className="cart-item-remove" onClick={() => void removeFromCart(item.productId)}>
                  Remove
                </button>
              </div>
              <div className="cart-item-bottom">
                <div className="cart-qty">
                  <button
                    disabled={item.quantity <= 1}
                    onClick={() => void updateQuantity(item.productId, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    &#x2212;
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    disabled={item.quantity >= 20}
                    onClick={() => void updateQuantity(item.productId, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <div>
                  <div className="cart-item-price">{formatPricePaise(item.lineTotalPaise, item.product.currency)}</div>
                  {item.quantity > 1 && (
                    <div className="cart-item-unit-price">{formatPricePaise(item.product.pricePaise, item.product.currency)} &#x00D7; {item.quantity}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary sidebar */}
      <aside className="cart-summary">
        <h2>Order Summary</h2>
        <div className="cart-summary-rows">
          <div className="cart-summary-row">
            <span>Subtotal ({cart.totalItems} {cart.totalItems === 1 ? "item" : "items"})</span>
            <span>{formatPricePaise(cart.subtotalPaise, cart.currency)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            {cart.subtotalPaise >= 99900 ? (
              <span className="free-tag">FREE</span>
            ) : (
              <span>&#x20B9;99</span>
            )}
          </div>
          <div className="cart-summary-row total">
            <span>Total</span>
            <span>
              {formatPricePaise(
                cart.subtotalPaise + (cart.subtotalPaise >= 99900 ? 0 : 9900),
                cart.currency
              )}
            </span>
          </div>
        </div>
        <Link href="/checkout" className="btn btn-dark">Proceed to Checkout</Link>
        <div className="cart-summary-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          Secure SSL checkout
        </div>
        <div className="cart-summary-guarantees">
          <div className="cart-summary-guarantee">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12l5 5L20 7" /></svg>
            Authentic
          </div>
          <div className="cart-summary-guarantee">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
            Free Ship 999+
          </div>
          <div className="cart-summary-guarantee">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
            7-Day Returns
          </div>
        </div>
      </aside>
    </div>
  );
}
