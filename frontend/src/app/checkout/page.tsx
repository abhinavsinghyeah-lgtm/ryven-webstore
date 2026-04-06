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
  const [paymentNotice, setPaymentNotice] = useState<"idle" | "completed" | "proceeding" | "confirming">("idle");
  const [shippingOption, setShippingOption] = useState<ShippingOption>("basic");

  const cartItems: CartItem[] = cart.items;

  if (!cart || !Array.isArray(cart.items)) {
    return (
      <main className="chk-page">
        <div className="chk-container">
          <ContentSkeleton rows={4} showAvatar={false} className="min-h-[440px]" />
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="chk-page">
        <div className="chk-empty">
          <div className="chk-empty-icon">🛍️</div>
          <h2>Your cart is empty</h2>
          <p>Add some fragrances before checking out.</p>
          <button onClick={() => router.push("/products")} className="chk-btn chk-btn-primary" style={{ width: "auto", display: "inline-flex" }}>
            Browse Collection &rarr;
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

      const handleConfirmed = async (verifyData: VerifyCheckoutResponse) => {
        confirmed = true;
        clearGuestCartItems();
        await refreshCart();
        sessionStorage.setItem(
          "ryven_last_order",
          JSON.stringify({ order: verifyData.order, isNew: verifyData.isNew, customerInfo }),
        );
        router.push("/checkout/success");
      };

      const confirmOnce = async () =>
        apiRequest<VerifyCheckoutResponse>("/checkout/confirm", {
          method: "POST",
          body: {
            razorpayOrderId: initData.razorpayOrderId,
            checkoutToken: initData.checkoutToken,
          },
        });

      const pollForConfirmation = async () => {
        const deadline = Date.now() + 120000;
        while (Date.now() < deadline) {
          await wait(6000);
          try {
            const confirmData = await confirmOnce();
            await handleConfirmed(confirmData);
            return;
          } catch (err) {
            const status = (err as Error & { status?: number }).status;
            if (status !== 409) {
              throw err;
            }
          }
        }
        throw new Error("Payment is still pending. Please check again in a few minutes.");
      };

      if (initData.skipRazorpay) {
        setPaymentNotice("confirming");
        const completeData = await apiRequest<VerifyCheckoutResponse>("/checkout/complete", {
          method: "POST",
          body: { checkoutToken: initData.checkoutToken },
        });
        await handleConfirmed(completeData);
        return;
      }

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

            await handleConfirmed(verifyData);
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
              const confirmData = await confirmOnce();
              await handleConfirmed(confirmData);
            } catch (err) {
              const status = (err as Error & { status?: number }).status;
              if (status === 409) {
                setPaymentNotice("confirming");
                try {
                  await pollForConfirmation();
                  return;
                } catch (pollErr) {
                  setError(pollErr instanceof Error ? pollErr.message : "Payment is still pending. Please check again soon.");
                }
              } else {
                setError(err instanceof Error ? err.message : "Payment is still pending. We will email you once confirmed.");
              }
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

  return (
    <main className="chk-page">
      <div className="chk-container">
        {/* Top bar */}
        <div className="chk-topbar">
          <div className="chk-logo">
            <Link href="/">RYVEN</Link>
          </div>
          <div className="chk-progress">
            <span className={`chk-dot${step >= 1 ? " active" : ""}`} />
            <span className={`chk-step-label${step === 1 ? " active" : ""}`}>Details</span>
            <span className={`chk-dot${step >= 2 || paymentNotice !== "idle" ? " active" : ""}`} />
            <span className={`chk-step-label${step === 2 ? " active" : ""}`}>Checkout</span>
          </div>
        </div>

        {/* Payment notice overlays */}
        {paymentNotice !== "idle" && (
          <div className="chk-notice">
            <div className="chk-notice-card">
              <div className="chk-spinner" />
              {paymentNotice === "completed" && (
                <>
                  <h3>2/2 steps completed!</h3>
                  <p>Address confirmed. Finalizing your secure checkout handoff.</p>
                </>
              )}
              {paymentNotice === "proceeding" && (
                <>
                  <h3>Proceeding to payment</h3>
                  <p>Opening Razorpay with your order details now.</p>
                </>
              )}
              {paymentNotice === "confirming" && (
                <>
                  <h3>Confirming payment...</h3>
                  <p>UPI can take a minute. We are checking your payment status.</p>
                </>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="chk-card" style={{ borderColor: "#d44", background: "#fff5f5", marginBottom: 20, padding: 16 }}>
            <p style={{ color: "#d44", fontSize: 14, fontWeight: 500 }}>{error}</p>
          </div>
        )}

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

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-4)", marginTop: 28 }}>
          &copy; {new Date().getFullYear()} RYVEN &middot; All rights reserved
        </p>
      </div>
    </main>
  );
}
