"use client";

import { useState } from "react";
import { CartItem } from "@/types/cart";
import { formatPricePaise } from "@/lib/format";
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
  shippingPaise: number;
  onBack: () => void;
  onPay: (address: AddressData) => void;
  paying: boolean;
}

const SHIPPING_PAISE = Number(process.env.NEXT_PUBLIC_SHIPPING_PAISE ?? 0);

export default function CheckoutStep2({ cartItems, shippingPaise, onBack, onPay, paying }: Props) {
  const [address, setAddress] = useState<AddressData>({
    line: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [errors, setErrors] = useState<Partial<AddressData>>({});

  const subtotalPaise = cartItems.reduce((s, i) => s + i.lineTotalPaise, 0);
  const totalPaise = subtotalPaise + (shippingPaise ?? SHIPPING_PAISE);

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

  const field = (
    id: keyof AddressData,
    label: string,
    placeholder: string,
    props?: React.InputHTMLAttributes<HTMLInputElement>,
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#333] mb-1.5">
        {label}
      </label>
      <input
        id={id}
        value={address[id]}
        onChange={(e) => setAddress((a) => ({ ...a, [id]: e.target.value }))}
        className={`w-full px-4 py-3 rounded-xl border bg-white text-[#111] placeholder:text-[#bbb] transition-all outline-none focus:ring-2 focus:ring-[#111]/20 ${
          errors[id] ? "border-red-400 ring-1 ring-red-200" : "border-[#ddd] hover:border-[#bbb]"
        }`}
        placeholder={placeholder}
        {...props}
      />
      {errors[id] && <p className="mt-1.5 text-xs text-red-500">{errors[id]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[#666] hover:text-[#111] transition-colors mb-5"
        >
          ← Back
        </button>
        <p className="text-xs uppercase tracking-widest text-[#888] mb-2 font-medium">Step 2 of 2 — Delivery Address</p>
        <h2 className="text-2xl font-semibold text-[#111]">Where should we deliver?</h2>
      </div>

      <div className="space-y-4">
        {field("line", "Street Address", "123, Rose Lane, MG Road")}

        <div className="grid grid-cols-2 gap-4">
          {field("city", "City", "Mumbai")}
          {field("state", "State", "Maharashtra")}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {field("pincode", "PIN Code", "400001", { maxLength: 6 })}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-[#333] mb-1.5">
              Country
            </label>
            <input
              id="country"
              value={address.country}
              readOnly
              className="w-full px-4 py-3 rounded-xl border border-[#ddd] bg-[#f8f8f6] text-[#555] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <OrderSummary items={cartItems} subtotalPaise={subtotalPaise} shippingPaise={shippingPaise ?? SHIPPING_PAISE} totalPaise={totalPaise} />

      <button
        type="submit"
        disabled={paying}
        className="w-full py-3.5 px-6 bg-[#111] text-white font-semibold rounded-xl hover:bg-[#333] active:bg-[#000] transition-colors text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {paying ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Processing…
          </span>
        ) : (
          `Pay ${formatPricePaise(totalPaise, "INR")} →`
        )}
      </button>

      <p className="text-center text-xs text-[#aaa]">
        Secured by Razorpay · 256-bit SSL encryption
      </p>
    </form>
  );
}
