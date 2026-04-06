"use client";

import { useState } from "react";

import OrderSummary from "./OrderSummary";
import type { CartItem } from "@/types/cart";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
}

interface Props {
  initialData?: Partial<FormData>;
  onNext: (data: FormData) => void;
  cartItems: CartItem[];
  shippingPaise?: number | null;
}

export default function CheckoutStep1({ initialData, onNext, cartItems, shippingPaise }: Props) {
  const [formData, setFormData] = useState<FormData>({
    fullName: initialData?.fullName ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const subtotalPaise = cartItems.reduce((sum, item) => sum + item.lineTotalPaise, 0);
  const totalPaise = subtotalPaise;

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = "Full name is required";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Valid email is required";
    }
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      errs.phone = "Valid 10-digit Indian mobile number required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="chk-grid" noValidate>
      <section>
        <div className="chk-header">
          <p className="chk-header-eyebrow">Step 1 of 2</p>
          <h1>Your Details</h1>
          <p>We&apos;ll use this email and number for order updates and payment confirmation.</p>
        </div>

        <div className="chk-card-warm" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="chk-field">
            <label htmlFor="fullName" className="chk-label">Full Name</label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={(e) => setFormData((f) => ({ ...f, fullName: e.target.value }))}
              className={`chk-input${errors.fullName ? " error" : ""}`}
              placeholder="Arjun Sharma"
            />
            {errors.fullName && <p className="chk-error">{errors.fullName}</p>}
          </div>

          <div className="chk-field">
            <label htmlFor="email" className="chk-label">Email Address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
              className={`chk-input${errors.email ? " error" : ""}`}
              placeholder="arjun@email.com"
            />
            {errors.email && <p className="chk-error">{errors.email}</p>}
          </div>

          <div className="chk-field">
            <label htmlFor="phone" className="chk-label">Mobile Number</label>
            <div className="chk-input-group">
              <span className="chk-input-prefix">+91</span>
              <input
                id="phone"
                type="tel"
                autoComplete="tel-national"
                value={formData.phone}
                onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                className={`chk-input${errors.phone ? " error" : ""}`}
                placeholder="9876543210"
                maxLength={10}
              />
            </div>
            {errors.phone && <p className="chk-error">{errors.phone}</p>}
          </div>

          <button type="submit" className="chk-btn chk-btn-primary">
            Continue to Delivery
          </button>
        </div>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="chk-card-warm">
          <p className="chk-card-title">Customer Summary</p>
          <p className="chk-card-desc">
            Checkout is completed in two clean steps: your details, then shipping and payment.
            We only ask what is required to confirm your order and hand off payment securely.
          </p>
        </div>

        <OrderSummary
          items={cartItems}
          subtotalPaise={subtotalPaise}
          shippingPaise={shippingPaise}
          shippingState="pending"
          totalPaise={totalPaise}
        />
      </section>
    </form>
  );
}
