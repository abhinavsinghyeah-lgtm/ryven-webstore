"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckoutStep1 from "@/components/checkout/CheckoutStep1";
import CheckoutStep2 from "@/components/checkout/CheckoutStep2";
import { useCart } from "@/contexts/CartContext";
import { apiRequest } from "@/lib/api";
import { openRazorpay } from "@/lib/razorpay";
import { clearGuestCartItems } from "@/lib/cart-storage";
import { ContentSkeleton } from "@/components/ui/ContentSkeleton";
import { StatusBanner } from "@/components/ui/StatusBanner";
import type { InitiateCheckoutResponse, VerifyCheckoutResponse } from "@/types/order";
import type { CartItem } from "@/types/cart";

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

type ShippingOption = "basic" | "express";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<"idle" | "completed" | "proceeding">("idle");
  const [shippingOption, setShippingOption] = useState<ShippingOption>("basic");

  const cartItems: CartItem[] = cart.items;

  if (!cart || !Array.isArray(cart.items)) {
    return (
      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <ContentSkeleton rows={4} showAvatar={false} className="min-h-[440px]" />
      </main>
    );
  }

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
    setPaymentNotice("completed");

    try {
      await wait(550);
      setPaymentNotice("proceeding");
      await wait(700);

      // Map cart items to the payload format backend expects
      const cartPayload = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const initData = await apiRequest<InitiateCheckoutResponse>("/checkout/initiate", {
        method: "POST",
        body: {
          customerInfo,
          shippingOption,
          address,
          cartItems: cartPayload,
        },
      });

      let confirmed = false;

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

            confirmed = true;
            clearGuestCartItems();
            await refreshCart();

            // Persist order data for success page
            sessionStorage.setItem(
              "ryven_last_order",
              JSON.stringify({ order: verifyData.order, isNew: verifyData.isNew, customerInfo }),
            );

            router.push("/checkout/success");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Order could not be confirmed. Contact support.");
            setPaymentNotice("idle");
            setPaying(false);
          }
        },
        modal: {
          ondismiss: async () => {
            if (confirmed) return;
            try {
              const confirmData = await apiRequest<VerifyCheckoutResponse>("/checkout/confirm", {
                method: "POST",
                body: {
                  razorpayOrderId: initData.razorpayOrderId,
                  checkoutToken: initData.checkoutToken,
                },
              });

              confirmed = true;
              clearGuestCartItems();
              await refreshCart();
              sessionStorage.setItem(
                "ryven_last_order",
                JSON.stringify({ order: confirmData.order, isNew: confirmData.isNew, customerInfo }),
              );
              router.push("/checkout/success");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Payment is still pending. We will email you once confirmed.");
              setPaymentNotice("idle");
              setPaying(false);
            }
          },
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPaymentNotice("idle");
      setPaying(false);
    }
  };

  const banner =
    paymentNotice === "completed"
      ? { variant: "success" as const, title: "2/2 steps completed!", description: "Address confirmed. Finalizing your secure checkout handoff." }
      : paymentNotice === "proceeding"
        ? { variant: "info" as const, title: "Proceeding to payment.", description: "Opening Razorpay with your order details now." }
        : step === 1
          ? { variant: "success" as const, title: "You are 1/2 step away", description: "Fill your contact details to continue to delivery and payment." }
          : { variant: "success" as const, title: "You are 2/2 step away", description: "Confirm the delivery address and continue to payment." };

  return (
    <main className="min-h-screen bg-[#f4f4f2] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-[0.2em] text-[#111] uppercase">
            RYVEN
          </Link>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <StepDot active={step >= 1} label="cart" />
            <StepDot active={step >= 2 || paymentNotice !== "idle"} label="checkout" />
          </div>
        </div>

        <div className="mb-6">
          <StatusBanner variant={banner.variant} title={banner.title} description={banner.description} />
        </div>

        {error && (
          <div className="mb-6">
            <StatusBanner variant="error" title={error} />
          </div>
        )}

        <div className="rounded-[2rem] bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:p-8">
          {step === 1 ? (
            <CheckoutStep1 initialData={customerInfo ?? undefined} onNext={handleStep1Next} cartItems={cartItems} />
          ) : (
            <CheckoutStep2
              cartItems={cartItems}
              shippingOption={shippingOption}
              onShippingChange={setShippingOption}
              onBack={() => setStep(1)}
              onPay={handlePay}
              paying={paying}
            />
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#888]">
          &copy; {new Date().getFullYear()} RYVEN · All rights reserved
        </p>
      </div>
    </main>
  );
}

function StepDot({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={active ? "grid h-6 w-6 place-items-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white" : "grid h-6 w-6 place-items-center rounded-full border border-neutral-300 text-[11px] font-semibold text-neutral-500"}>
        {active ? "●" : "○"}
      </div>
      <span className="text-xs uppercase tracking-[0.16em]">{label}</span>
    </div>
  );
}
