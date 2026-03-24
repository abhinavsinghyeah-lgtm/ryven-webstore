"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Order } from "@/types/order";
import { formatPricePaise } from "@/lib/format";

interface StoredData {
  order: Order;
  isNew: boolean;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [data] = useState<StoredData | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = sessionStorage.getItem("ryven_last_order");
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as StoredData;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!data) {
      router.replace("/");
      return;
    }

    sessionStorage.removeItem("ryven_last_order");
  }, [data, router]);

  if (!data) return null;

  const { order, isNew } = data;
  const currency = order.currency;

  return (
    <main className="min-h-screen bg-[#f1f1ee] flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo */}
        <div className="text-center mb-2">
          <Link href="/" className="text-xl font-bold tracking-[0.2em] text-[#111] uppercase">
            RYVEN
          </Link>
        </div>

        {/* Hero card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-8 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-[#111]">Order Confirmed!</h1>
          <p className="text-[#555] text-sm leading-relaxed">
            Thank you{order.shippingName ? `, ${order.shippingName.split(" ")[0]}` : ""}. We&apos;ve received your order and
            will send you an email confirmation shortly.
          </p>
          <p className="text-xs text-[#aaa] tracking-wider uppercase">
            Order #{String(order.id).padStart(6, "0")}
          </p>
        </div>

        {/* New user banner */}
        {isNew && (
          <div className="bg-[#111] text-white rounded-2xl p-5 space-y-2">
            <p className="font-semibold text-sm">🔑 Set a password to access your account</p>
            <p className="text-xs text-white/70 leading-relaxed">
              We&apos;ve sent an activation link to your email. Click it to create a password and track your orders
              anytime.
            </p>
          </div>
        )}

        {/* Order summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#111] uppercase tracking-wider">Your Items</h2>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-[#333]">
                  {item.productName}{" "}
                  <span className="text-[#aaa] font-normal">× {item.quantity}</span>
                </span>
                <span className="font-semibold text-[#111]">
                  {formatPricePaise(item.lineTotalPaise, item.currency)}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-[#eee] pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-[#555]">
              <span>Subtotal</span>
              <span>{formatPricePaise(order.subtotalPaise, currency)}</span>
            </div>
            <div className="flex justify-between text-[#555]">
              <span>Shipping</span>
              <span>{order.shippingPaise === 0 ? "Free" : formatPricePaise(order.shippingPaise, currency)}</span>
            </div>
            <div className="flex justify-between font-bold text-[#111] text-base pt-1">
              <span>Total Paid</span>
              <span>{formatPricePaise(order.totalPaise, currency)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-5 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#888] mb-2">Delivering To</p>
          <p className="text-sm text-[#111] font-medium">{order.shippingName}</p>
          <p className="text-sm text-[#555]">{order.shippingAddress}</p>
          <p className="text-sm text-[#555]">
            {order.shippingCity}, {order.shippingState} — {order.shippingPincode}
          </p>
          <p className="text-sm text-[#555]">{order.shippingCountry}</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/products"
            className="flex-1 py-3 px-4 border border-[#ddd] rounded-xl text-sm font-semibold text-[#333] text-center hover:border-[#bbb] hover:bg-[#fafaf8] transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 px-4 bg-[#111] text-white rounded-xl text-sm font-semibold text-center hover:bg-[#333] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
