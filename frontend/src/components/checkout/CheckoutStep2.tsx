"use client";

import { useState } from "react";
import { CartItem } from "@/types/cart";
import OrderSummary from "./OrderSummary";

interface AddressData {
  line: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface Props {
  cartItems: CartItem[];
  shippingOption: "basic" | "express";
  onShippingChange: (option: "basic" | "express") => void;
  onBack: () => void;
  onPay: (address: AddressData) => void;
  paying: boolean;
}

const SHIPPING_OPTIONS = {
  basic: {
    label: "Basic",
    description: "Delivery in 4-5 days",
    pricePaise: 6000,
  },
  express: {
    label: "Express AIR",
    description: "Delivers in 1-2 days",
    pricePaise: 12000,
  },
} as const;

export default function CheckoutStep2({ cartItems, shippingOption, onShippingChange, onBack, onPay, paying }: Props) {
  const [address, setAddress] = useState<AddressData>({
    line: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [errors, setErrors] = useState<Partial<AddressData>>({});

  const subtotalPaise = cartItems.reduce((s, i) => s + i.lineTotalPaise, 0);
  const shippingPaise = SHIPPING_OPTIONS[shippingOption].pricePaise;
  const totalPaise = subtotalPaise + shippingPaise;

  const validate = (): boolean => {
    const errs: Partial<AddressData> = {};
    if (!address.line.trim()) errs.line = "Address is required";
    if (!address.city.trim()) errs.city = "City is required";
    if (!address.state.trim()) errs.state = "State is required";
    if (!/^\d{6}$/.test(address.pincode)) errs.pincode = "Valid 6-digit PIN code required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onPay(address);
  };

  return (
    <form onSubmit={handleSubmit} className="chk-grid" noValidate>
      <section>
        <button type="button" onClick={onBack} className="chk-back">
          &#8592; Back
        </button>

        <div className="chk-header">
          <p className="chk-header-eyebrow">Step 2 of 2</p>
          <h1>Shipping Details</h1>
        </div>

        {/* Shipping option picker */}
        <div className="chk-card" style={{ marginBottom: 20 }}>
          <p className="chk-card-title">Choose a delivery service</p>
          <p className="chk-card-desc">Select the speed that works best for you.</p>

          <div className="chk-shipping-options">
            <label className={`chk-shipping-option${shippingOption === "basic" ? " selected" : ""}`}>
              <input
                type="radio"
                name="shipping"
                value="basic"
                checked={shippingOption === "basic"}
                onChange={() => onShippingChange("basic")}
              />
              <div className="chk-shipping-icon">
                <svg viewBox="0 0 24 24"><path d="M3 7h11v10H3V7zm12 1h3l3 4v5h-6V8zm-8 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" /></svg>
              </div>
              <p className="chk-shipping-name">Basic</p>
              <p className="chk-shipping-desc">Delivery in 4-5 days</p>
              <p className="chk-shipping-price">{"\u20B9"}60 flat</p>
            </label>

            <label className={`chk-shipping-option${shippingOption === "express" ? " selected" : ""}`}>
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={shippingOption === "express"}
                onChange={() => onShippingChange("express")}
              />
              <div className="chk-shipping-icon">
                <svg viewBox="0 0 24 24"><path d="M2 12l19-8-5 18-4-6-10-4z" /></svg>
              </div>
              <p className="chk-shipping-name">Express AIR</p>
              <p className="chk-shipping-desc">Delivers in 1-2 days</p>
              <p className="chk-shipping-price">{"\u20B9"}120 flat</p>
            </label>
          </div>
        </div>

        {/* Address form */}
        <div className="chk-card-warm" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="chk-field">
            <label htmlFor="line" className="chk-label">Street Address</label>
            <input
              id="line"
              value={address.line}
              onChange={(e) => setAddress((a) => ({ ...a, line: e.target.value }))}
              className={`chk-input${errors.line ? " error" : ""}`}
              placeholder="123, Rose Lane, MG Road"
            />
            {errors.line && <p className="chk-error">{errors.line}</p>}
          </div>

          <div className="chk-row">
            <div className="chk-field">
              <label htmlFor="city" className="chk-label">City</label>
              <input
                id="city"
                value={address.city}
                onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                className={`chk-input${errors.city ? " error" : ""}`}
                placeholder="Mumbai"
              />
              {errors.city && <p className="chk-error">{errors.city}</p>}
            </div>
            <div className="chk-field">
              <label htmlFor="state" className="chk-label">State</label>
              <input
                id="state"
                value={address.state}
                onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                className={`chk-input${errors.state ? " error" : ""}`}
                placeholder="Maharashtra"
              />
              {errors.state && <p className="chk-error">{errors.state}</p>}
            </div>
          </div>

          <div className="chk-row">
            <div className="chk-field">
              <label htmlFor="pincode" className="chk-label">PIN Code</label>
              <input
                id="pincode"
                value={address.pincode}
                onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value }))}
                className={`chk-input${errors.pincode ? " error" : ""}`}
                placeholder="400001"
                maxLength={6}
              />
              {errors.pincode && <p className="chk-error">{errors.pincode}</p>}
            </div>
            <div className="chk-field">
              <label htmlFor="country" className="chk-label">Country</label>
              <input id="country" value={address.country} readOnly className="chk-input" style={{ background: "var(--bg-warm)", color: "var(--text-2)" }} />
            </div>
          </div>
        </div>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="chk-card">
          <button type="submit" disabled={paying} className="chk-btn chk-btn-pay">
            {paying ? "Processing..." : "Place Order"}
          </button>
          <p className="chk-summary-note" style={{ marginTop: 12 }}>
            By placing your order, you agree to our company privacy policy and conditions of use.
          </p>

          <div style={{ marginTop: 20 }}>
            <OrderSummary
              items={cartItems}
              subtotalPaise={subtotalPaise}
              shippingPaise={shippingPaise}
              shippingLabel={`${SHIPPING_OPTIONS[shippingOption].label} \u00B7 ${SHIPPING_OPTIONS[shippingOption].description}`}
              totalPaise={totalPaise}
            />
          </div>
        </div>

        <p className="chk-summary-note" style={{ textAlign: "center" }}>Secured by Razorpay &middot; 256-bit SSL encryption</p>
      </section>
    </form>
  );
}
