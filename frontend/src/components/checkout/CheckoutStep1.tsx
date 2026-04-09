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
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]" noValidate>
      <section>
        <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Step 1 of 2</p>
        <h2 className="mt-3 text-3xl font-semibold text-neutral-900">Your Details</h2>
        <p className="mt-2 text-sm text-neutral-600">We’ll use this email and number for order updates and payment confirmation.</p>

        <div className="mt-8 space-y-5 rounded-[1.5rem] border border-neutral-200 bg-[#fafaf8] p-5 sm:p-6">
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-[#333]">Full Name</label>
            <input id="fullName" type="text" autoComplete="name" value={formData.fullName} onChange={(e) => setFormData((f) => ({ ...f, fullName: e.target.value }))} className={`w-full rounded-xl border bg-white px-4 py-3 text-[#111] placeholder:text-[#bbb] outline-none transition-all focus:ring-2 focus:ring-[#111]/10 ${errors.fullName ? "border-red-400 ring-1 ring-red-200" : "border-[#ddd] hover:border-[#bbb]"}`} placeholder="Arjun Sharma" />
            {errors.fullName && <p className="mt-1.5 text-xs text-red-500">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#333]">Email Address</label>
            <input id="email" type="email" autoComplete="email" value={formData.email} onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))} className={`w-full rounded-xl border bg-white px-4 py-3 text-[#111] placeholder:text-[#bbb] outline-none transition-all focus:ring-2 focus:ring-[#111]/10 ${errors.email ? "border-red-400 ring-1 ring-red-200" : "border-[#ddd] hover:border-[#bbb]"}`} placeholder="arjun@email.com" />
            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-[#333]">Mobile Number</label>
            <div className="flex">
              <span className="flex items-center rounded-l-xl border border-r-0 border-[#ddd] bg-[#f8f8f6] px-4 text-sm text-[#555] select-none">+91</span>
              <input id="phone" type="tel" autoComplete="tel-national" value={formData.phone} onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} className={`w-full rounded-r-xl border bg-white px-4 py-3 text-[#111] placeholder:text-[#bbb] outline-none transition-all focus:ring-2 focus:ring-[#111]/10 ${errors.phone ? "border-red-400 ring-1 ring-red-200" : "border-[#ddd] hover:border-[#bbb]"}`} placeholder="9876543210" maxLength={10} />
            </div>
            {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
          </div>

          <button type="submit" className="w-full rounded-xl bg-[#111] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#333]">
            Continue to Delivery
          </button>
        </div>
      </section>

      <section className="space-y-5">
        <div className="rounded-[1.5rem] border border-neutral-200 bg-[#fafaf8] p-5 sm:p-6">
          <p className="text-sm font-semibold text-neutral-900">Customer Summary</p>
          <div className="mt-4 space-y-3 text-sm text-neutral-600">
            <p>Checkout is completed in two clean steps: your details, then shipping and payment.</p>
            <p>We only ask what is required to confirm your order and hand off payment securely.</p>
          </div>
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
