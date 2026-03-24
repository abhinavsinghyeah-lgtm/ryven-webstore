"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutStep1 from "@/components/checkout/CheckoutStep1";
import CheckoutStep2 from "@/components/checkout/CheckoutStep2";
import { useCart } from "@/contexts/CartContext";
import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { openRazorpay } from "@/lib/razorpay";
import { clearGuestCartItems } from "@/lib/cart-storage";
import type { InitiateCheckoutResponse, VerifyCheckoutResponse } from "@/types/order";
import type { CartItem } from "@/types/cart";
import type { AuthResponse } from "@/types/auth";

interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
}

interface AddressData {
  line: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

const SHIPPING_PAISE = 0; // free shipping

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const cartItems: CartItem[] = cart.items;

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="text-5xl">🛍️</div>
          <h2 className="text-xl font-semibold text-[#111]">Your cart is empty</h2>
          <p className="text-[#666] text-sm">Add some fragrances before checking out.</p>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-3 bg-[#111] text-white rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors"
          >
            Browse Collection →
          </button>
        </div>
      </main>
    );
  }

  const handleStep1Next = (data: CustomerInfo) => {
    setCustomerInfo(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePay = async (address: AddressData) => {
    if (!customerInfo) return;
    setError(null);
    setPaying(true);

    try {
      // Map cart items to the payload format backend expects
      const cartPayload = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const initData = await apiRequest<InitiateCheckoutResponse>("/checkout/initiate", {
        method: "POST",
        body: {
          customerInfo,
          address,
          cartItems: cartPayload,
        },
      });

      await openRazorpay({
        key: initData.razorpayKeyId,
        amount: initData.amount,
        currency: initData.currency,
        order_id: initData.razorpayOrderId,
        name: "RYVEN",
        description: "Fragrance Order",
        prefill: {
          name: initData.userName,
          email: initData.userEmail,
          contact: `+91${customerInfo.phone}`,
        },
        theme: { color: "#111111" },
        handler: async (response) => {
          try {
            const verifyData = await apiRequest<VerifyCheckoutResponse>("/checkout/verify", {
              method: "POST",
              body: {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                checkoutToken: initData.checkoutToken,
              },
            });

            // Auto-login with the issued JWT
            authStorage.saveAuth({
              token: verifyData.authToken,
              user: {
                id: verifyData.order.userId,
                fullName: customerInfo.fullName,
                email: customerInfo.email,
                role: "customer",
              },
            } as AuthResponse);

            clearGuestCartItems();
            await refreshCart();

            // Persist order data for success page
            sessionStorage.setItem(
              "ryven_last_order",
              JSON.stringify({ order: verifyData.order, isNew: verifyData.isNew }),
            );

            router.push("/checkout/success");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Order could not be confirmed. Contact support.");
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPaying(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f1f1ee]">
      {/* Progress bar */}
      <div className="h-1 bg-[#e0e0da]">
        <div
          className="h-full bg-[#111] transition-all duration-500"
          style={{ width: step === 1 ? "50%" : "100%" }}
        />
      </div>

      <div className="max-w-lg mx-auto px-4 py-10 sm:py-16">
        {/* Logo */}
        <div className="mb-10 text-center">
          <a href="/" className="text-xl font-bold tracking-[0.2em] text-[#111] uppercase">
            RYVEN
          </a>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-6 sm:p-8">
          {step === 1 && (
            <CheckoutStep1
              initialData={customerInfo ?? undefined}
              onNext={handleStep1Next}
            />
          )}
          {step === 2 && (
            <CheckoutStep2
              cartItems={cartItems}
              shippingPaise={SHIPPING_PAISE}
              onBack={() => setStep(1)}
              onPay={handlePay}
              paying={paying}
            />
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#aaa]">
          &copy; {new Date().getFullYear()} RYVEN · All rights reserved
        </p>
      </div>
    </main>
  );
}
