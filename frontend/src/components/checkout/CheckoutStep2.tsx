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
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]" noValidate>
      <section>
        <button type="button" onClick={onBack} className="mb-5 flex items-center gap-1.5 text-sm text-[#666] transition-colors hover:text-[#111]">
          ← Back
        </button>
        <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Step 2 of 2</p>
        <h2 className="mt-3 text-3xl font-semibold text-[#111]">Shipping Details</h2>

        <div className="mt-8 space-y-4 rounded-[1.5rem] border border-neutral-200 bg-[#fafaf8] p-5 sm:p-6">
          {field("line", "Street Address", "123, Rose Lane, MG Road")}

          <div className="grid grid-cols-2 gap-4">
            {field("city", "City", "Mumbai")}
            {field("state", "State", "Maharashtra")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {field("pincode", "PIN Code", "400001", { maxLength: 6 })}
            <div>
              <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-[#333]">Country</label>
              <input id="country" value={address.country} readOnly className="w-full rounded-xl border border-[#ddd] bg-[#f8f8f6] px-4 py-3 text-[#555] outline-none" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)] sm:p-6">
          <button type="submit" disabled={paying} className="h-12 w-full rounded-xl bg-[#5b43f4] text-sm font-semibold text-white transition hover:bg-[#4e37df] disabled:cursor-not-allowed disabled:opacity-60">
            {paying ? "Processing..." : "Place Order"}
          </button>
          <p className="mt-3 text-xs leading-5 text-neutral-500">By placing your order, you agree to our company privacy policy and conditions of use.</p>

          <div className="mt-6">
            <OrderSummary items={cartItems} subtotalPaise={subtotalPaise} shippingPaise={shippingPaise ?? SHIPPING_PAISE} totalPaise={totalPaise} />
          </div>
        </div>

        <p className="text-center text-xs text-[#888]">Secured by Razorpay · 256-bit SSL encryption</p>
      </section>
    </form>
  );
}
