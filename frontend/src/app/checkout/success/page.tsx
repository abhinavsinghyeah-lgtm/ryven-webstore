"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Order } from "@/types/order";
import { formatPricePaise } from "@/lib/format";
import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import type { AuthResponse } from "@/types/auth";

interface StoredData {
  order: Order;
  isNew: boolean;
  customerInfo?: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [data] = useState<StoredData | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const raw = sessionStorage.getItem("ryven_last_order");
      if (!raw) {
        return null;
      }
      return JSON.parse(raw) as StoredData;
    } catch {
      return null;
    }
  });

  const [otpStep, setOtpStep] = useState<"request" | "verify" | "done">("request");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    if (!data) {
      router.replace("/");
      return;
    }

    try {
      sessionStorage.removeItem("ryven_last_order");
    } catch {
      // Ignore storage errors.
    }
  }, [data, router]);

  useEffect(() => {
    if (!data) return;
    setIdentifier((prev) => prev || data.customerInfo?.email || data.order.shippingPhone || "");
  }, [data]);

  if (!data) {
    return (
      <main className="min-h-screen bg-[#f1f1ee] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[#e8e8e4] bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-[#111]">Order status unavailable</h1>
          <p className="mt-2 text-sm text-[#555]">We couldn&apos;t find the latest order details. Please return home and try again.</p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#111] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#333]"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  const { order, isNew, customerInfo } = data;
  const currency = order.currency || "INR";
  const formatSafe = (value: number, itemCurrency?: string | null) =>
    formatPricePaise(value, itemCurrency || currency || "INR");
  const orderItems = Array.isArray(order.items) ? order.items : [];

  const sendOtp = async () => {
    if (!identifier.trim()) {
      setOtpError("Enter your email or phone number.");
      return;
    }
    setOtpLoading(true);
    setOtpError(null);
    setOtpSuccess(null);
    try {
      await apiRequest("/auth/request-otp", {
        method: "POST",
        body: {
          identifier,
          fullName: customerInfo?.fullName || order.shippingName,
          email: customerInfo?.email || undefined,
          phone: customerInfo?.phone || undefined,
        },
      });
      setOtpStep("verify");
      setOtpSuccess("OTP sent. Enter the code to access your dashboard.");
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      if (status === 503 && customerInfo?.email) {
        setIdentifier(customerInfo.email);
        setOtpError("SMS OTP is unavailable right now. We switched to email.");
      } else {
        setOtpError(err instanceof Error ? err.message : "Could not send OTP");
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("Enter the OTP code.");
      return;
    }
    setOtpLoading(true);
    setOtpError(null);
    setOtpSuccess(null);
    try {
      const response = await apiRequest<AuthResponse>("/auth/verify-otp", {
        method: "POST",
        body: { identifier, code: otp.trim() },
      });
      authStorage.saveAuth(response);
      setOtpStep("done");
      setOtpSuccess("Logged in. You can now view your dashboard.");
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

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
            <p className="font-semibold text-sm">✅ Account created</p>
            <p className="text-xs text-white/70 leading-relaxed">
              We created an account for you using your email and phone. Verify OTP below to access your dashboard.
            </p>
          </div>
        )}

        {/* Order summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#111] uppercase tracking-wider">Your Items</h2>
          {orderItems.length === 0 ? (
            <p className="text-sm text-[#555]">No items found on this order.</p>
          ) : (
            <ul className="space-y-3">
              {orderItems.map((item, index) => (
                <li key={`${item.productId ?? "item"}-${index}`} className="flex items-center justify-between text-sm">
                  <span className="text-[#333]">
                    {item.productName}{" "}
                    <span className="text-[#aaa] font-normal">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-[#111]">
                    {formatSafe(item.lineTotalPaise, item.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-[#eee] pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-[#555]">
              <span>Subtotal</span>
              <span>{formatSafe(order.subtotalPaise)}</span>
            </div>
            <div className="flex justify-between text-[#555]">
              <span>Shipping</span>
              <span>{order.shippingPaise === 0 ? "Free" : formatSafe(order.shippingPaise)}</span>
            </div>
            {order.shippingService ? (
              <p className="text-xs text-[#888]">Service: {order.shippingService}</p>
            ) : null}
            <div className="flex justify-between font-bold text-[#111] text-base pt-1">
              <span>Total Paid</span>
              <span>{formatSafe(order.totalPaise)}</span>
            </div>
          </div>
        </div>

        {/* OTP access card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#888]">Access Your Dashboard</p>
            <h3 className="mt-2 text-lg font-semibold text-[#111]">Track orders with OTP</h3>
            <p className="mt-2 text-sm text-[#555]">
              {isNew
                ? "We created an account for you. Verify OTP to access your dashboard."
                : "Verify OTP to view your orders and manage your account."}
            </p>
          </div>

          {otpStep === "request" ? (
            <div className="space-y-3">
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Email or mobile number"
                className="w-full rounded-xl border border-[#ddd] px-4 py-3 text-sm outline-none focus:border-[#111]"
              />
              <button
                type="button"
                onClick={sendOtp}
                disabled={otpLoading}
                className="w-full rounded-xl bg-[#111] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#333] disabled:opacity-60"
              >
                {otpLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          ) : otpStep === "verify" ? (
            <div className="space-y-3">
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter OTP"
                className="w-full rounded-xl border border-[#ddd] px-4 py-3 text-sm outline-none focus:border-[#111]"
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={otpLoading}
                className="w-full rounded-xl bg-[#111] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#333] disabled:opacity-60"
              >
                {otpLoading ? "Verifying..." : "Verify & Continue"}
              </button>
              <button
                type="button"
                onClick={() => setOtpStep("request")}
                className="text-xs font-semibold text-[#555] underline decoration-2 underline-offset-4"
              >
                Change details
              </button>
            </div>
          ) : (
            <Link
              href="/account"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#111] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#333]"
            >
              View Dashboard
            </Link>
          )}

          {otpError ? <p className="text-xs text-red-600">{otpError}</p> : null}
          {otpSuccess ? <p className="text-xs text-emerald-600">{otpSuccess}</p> : null}
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
