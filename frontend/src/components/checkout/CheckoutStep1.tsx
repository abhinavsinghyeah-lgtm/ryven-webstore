"use client";

import { useState } from "react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
}

interface Props {
  initialData?: Partial<FormData>;
  onNext: (data: FormData) => void;
}

export default function CheckoutStep1({ initialData, onNext }: Props) {
  const [formData, setFormData] = useState<FormData>({
    fullName: initialData?.fullName ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <p className="text-xs uppercase tracking-widest text-[#888] mb-6 font-medium">Step 1 of 2 — Your Details</p>
        <h2 className="text-2xl font-semibold text-[#111] mb-1">Who are we sending this to?</h2>
        <p className="text-[#666] text-sm">Your order will be linked to this email.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[#333] mb-1.5">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={formData.fullName}
            onChange={(e) => setFormData((f) => ({ ...f, fullName: e.target.value }))}
            className={`w-full px-4 py-3 rounded-xl border bg-white text-[#111] placeholder:text-[#bbb] transition-all outline-none focus:ring-2 focus:ring-[#111]/20 ${
              errors.fullName ? "border-red-400 ring-1 ring-red-200" : "border-[#ddd] hover:border-[#bbb]"
            }`}
            placeholder="Arjun Sharma"
          />
          {errors.fullName && <p className="mt-1.5 text-xs text-red-500">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#333] mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
            className={`w-full px-4 py-3 rounded-xl border bg-white text-[#111] placeholder:text-[#bbb] transition-all outline-none focus:ring-2 focus:ring-[#111]/20 ${
              errors.email ? "border-red-400 ring-1 ring-red-200" : "border-[#ddd] hover:border-[#bbb]"
            }`}
            placeholder="arjun@email.com"
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#333] mb-1.5">
            Mobile Number
          </label>
          <div className="flex">
            <span className="flex items-center px-4 border border-r-0 border-[#ddd] bg-[#f8f8f6] rounded-l-xl text-sm text-[#555] select-none">
              +91
            </span>
            <input
              id="phone"
              type="tel"
              autoComplete="tel-national"
              value={formData.phone}
              onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
              className={`w-full px-4 py-3 rounded-r-xl border bg-white text-[#111] placeholder:text-[#bbb] transition-all outline-none focus:ring-2 focus:ring-[#111]/20 ${
                errors.phone ? "border-red-400 ring-1 ring-red-200" : "border-[#ddd] hover:border-[#bbb]"
              }`}
              placeholder="9876543210"
              maxLength={10}
            />
          </div>
          {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 px-6 bg-[#111] text-white font-semibold rounded-xl hover:bg-[#333] active:bg-[#000] transition-colors text-sm tracking-wide"
      >
        Continue to Delivery →
      </button>
    </form>
  );
}
