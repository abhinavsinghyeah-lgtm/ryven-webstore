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
      <main className="chk-success">
        <div className="chk-success-container" style={{ textAlign: "center" }}>
          <div className="chk-card" style={{ padding: 32 }}>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)" }}>Order status unavailable</h1>
            <p style={{ fontSize: 14, color: "var(--text-2)", marginTop: 8 }}>
              We couldn&apos;t find the latest order details. Please return home and try again.
            </p>
            <Link href="/" className="chk-btn chk-btn-primary" style={{ width: "auto", display: "inline-flex", marginTop: 16 }}>
              Back to home
            </Link>
          </div>
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
    <main className="chk-success">
      <div className="chk-success-container">
        {/* Logo */}
        <div className="chk-logo" style={{ marginBottom: 20 }}>
          <Link href="/">RYVEN</Link>
        </div>

        {/* Hero card */}
        <div className="chk-success-hero">
          <div className="chk-success-icon">&#10003;</div>
          <h1>Order Confirmed!</h1>
          <p>
            Thank you{order.shippingName ? `, ${order.shippingName.split(" ")[0]}` : ""}. We&apos;ve received your order and
            will send you an email confirmation shortly.
          </p>
          <p className="chk-order-id">
            Order #{String(order.id).padStart(6, "0")}
          </p>
        </div>

        {/* New user banner */}
        {isNew && (
          <div className="chk-new-user-banner">
            <p>&#9989; Account created</p>
            <p>
              We created an account for you using your email and phone. Verify OTP below to access your dashboard.
            </p>
          </div>
        )}

        {/* Order summary */}
        <div className="chk-card" style={{ marginTop: 16 }}>
          <p className="chk-summary-title">Your Items</p>
          {orderItems.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--text-2)" }}>No items found on this order.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {orderItems.map((item, index) => (
                <div key={`${item.productId ?? "item"}-${index}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14 }}>
                  <span style={{ color: "var(--text)" }}>
                    {item.productName}{" "}
                    <span style={{ color: "var(--text-3)", fontWeight: 400 }}>&times; {item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>
                    {formatSafe(item.lineTotalPaise, item.currency)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="chk-summary-totals">
            <div className="chk-summary-row">
              <span>Subtotal</span>
              <span>{formatSafe(order.subtotalPaise)}</span>
            </div>
            <div className="chk-summary-row">
              <span>Shipping</span>
              <span>{order.shippingPaise === 0 ? "Free" : formatSafe(order.shippingPaise)}</span>
            </div>
            {order.shippingService ? (
              <p className="chk-summary-note">Service: {order.shippingService}</p>
            ) : null}
            <div className="chk-summary-row total">
              <span>Total Paid</span>
              <span>{formatSafe(order.totalPaise)}</span>
            </div>
          </div>
        </div>

        {/* OTP access card */}
        <div className="chk-otp-card">
          <div>
            <p className="chk-summary-title">Access Your Dashboard</p>
            <h3>Track orders with OTP</h3>
            <p style={{ fontSize: 14, color: "var(--text-2)", marginTop: 8 }}>
              {isNew
                ? "We created an account for you. Verify OTP to access your dashboard."
                : "Verify OTP to view your orders and manage your account."}
            </p>
          </div>

          {otpStep === "request" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Email or mobile number"
                className="chk-input"
              />
              <button
                type="button"
                onClick={sendOtp}
                disabled={otpLoading}
                className="chk-btn chk-btn-primary"
              >
                {otpLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          ) : otpStep === "verify" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter OTP"
                className="chk-input"
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={otpLoading}
                className="chk-btn chk-btn-primary"
              >
                {otpLoading ? "Verifying..." : "Verify & Continue"}
              </button>
              <button
                type="button"
                onClick={() => setOtpStep("request")}
                style={{ fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                Change details
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 14 }}>
              <Link href="/account" className="chk-btn chk-btn-primary">
                View Dashboard
              </Link>
            </div>
          )}

          {otpError ? <p className="chk-error" style={{ marginTop: 10 }}>{otpError}</p> : null}
          {otpSuccess ? <p style={{ fontSize: 12, color: "var(--green)", marginTop: 10 }}>{otpSuccess}</p> : null}
        </div>

        {/* Shipping address */}
        <div className="chk-card" style={{ marginTop: 16 }}>
          <p className="chk-summary-title" style={{ marginBottom: 8 }}>Delivering To</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{order.shippingName}</p>
          <p style={{ fontSize: 14, color: "var(--text-2)" }}>{order.shippingAddress}</p>
          <p style={{ fontSize: 14, color: "var(--text-2)" }}>
            {order.shippingCity}, {order.shippingState} &mdash; {order.shippingPincode}
          </p>
          <p style={{ fontSize: 14, color: "var(--text-2)" }}>{order.shippingCountry}</p>
        </div>

        <div className="chk-success-actions">
          <Link href="/products" className="chk-btn chk-btn-ghost">
            Continue Shopping
          </Link>
          <Link href="/" className="chk-btn chk-btn-primary" style={{ flex: 1 }}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
