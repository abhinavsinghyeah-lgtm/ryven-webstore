"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCart } from "@/contexts/CartContext";
import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { syncGuestCartAfterLogin } from "@/lib/cart-sync";
import type { AuthResponse } from "@/types/auth";
import OTPDialog from "@/components/ui/otpdialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "login" | "signup";

type AuthFormProps = {
  mode: Mode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { refreshCart } = useCart();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);

  const isSignup = mode === "signup";

  const buildRequestPayload = () =>
    isSignup
      ? { identifier: email.trim(), fullName: fullName.trim(), email: email.trim(), phone: phone.trim() }
      : { identifier: identifier.trim() };

  const handleRequestOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setOtpError(null);
    setOtpSuccess(null);
    setIsSubmitting(true);

    try {
      const body = buildRequestPayload();
      await apiRequest("/auth/request-otp", {
        method: "POST",
        body,
      });

      const currentIdentifier = isSignup ? email.trim() : identifier.trim();
      setOtpIdentifier(currentIdentifier);
      setOtpOpen(true);
      setOtpSuccess("OTP sent. Enter the code to continue.");
    } catch (requestError) {
      const err = requestError as Error & { status?: number };
      if (err.status === 503 && !isSignup) {
        setError("SMS OTP is unavailable right now. Please use your email address.");
      } else {
        const message = requestError instanceof Error ? requestError.message : "Something went wrong";
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    setOtpLoading(true);
    setOtpError(null);
    setOtpSuccess(null);
    try {
      const response = await apiRequest<AuthResponse>("/auth/verify-otp", {
        method: "POST",
        body: { identifier: otpIdentifier, code },
      });

      authStorage.saveAuth(response);
      await syncGuestCartAfterLogin();
      await refreshCart();
      setOtpSuccess("✅ Verified. Redirecting...");
      setTimeout(() => {
        router.push(response.user.role === "admin" ? "/admin" : "/account");
      }, 600);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "OTP verification failed";
      setOtpError(message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError(null);
    setOtpSuccess(null);
    const body = buildRequestPayload();
    await apiRequest("/auth/request-otp", {
      method: "POST",
      body,
    });
    setOtpSuccess("OTP resent. Check your inbox.");
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleRequestOtp}
        className="space-y-5 rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-neutral-800 shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 5v14" />
              <path d="M6 11l6 6 6-6" />
            </svg>
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">{isSignup ? "Create account" : "Welcome back"}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            {isSignup ? "Sign up with OTP" : "Sign in with OTP"}
          </h1>
          <p className="text-sm text-neutral-600">
            {isSignup ? "Start your scent journey with secure OTP access." : "Access your account and orders securely."}
          </p>
        </div>

        {isSignup ? (
          <>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-neutral-800">Full name</span>
              <Input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                placeholder="Aarav Sharma"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-neutral-800">Email</span>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-neutral-800">Mobile number</span>
              <Input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                placeholder="+91 9876543210"
              />
            </label>
          </>
        ) : (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-800">Email or mobile number</span>
            <Input
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
              placeholder="you@example.com or +91 9876543210"
            />
          </label>
        )}

        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <Button
          type="submit"
          className="w-full rounded-xl bg-neutral-900 text-white shadow-[0_10px_20px_rgba(15,23,42,0.2)] hover:bg-neutral-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Continue"}
        </Button>

        <p className="text-sm text-neutral-600">
          {isSignup ? "Already registered? " : "New to RYVEN? "}
          <Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-neutral-900 underline decoration-2 underline-offset-4">
            {isSignup ? "Sign in" : "Create account"}
          </Link>
        </p>
      </form>

      <OTPDialog
        open={otpOpen}
        onOpenChange={setOtpOpen}
        identifierLabel={isSignup ? "Email" : "Email or phone"}
        identifierValue={otpIdentifier || "your contact"}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        loading={otpLoading}
        error={otpError}
        success={otpSuccess}
      />
    </div>
  );
}
