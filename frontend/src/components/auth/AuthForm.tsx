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

type RequestOtpResponse = {
  status: string;
  reusedExisting?: boolean;
  retryAfterSeconds?: number;
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
  const [otpCooldownUntil, setOtpCooldownUntil] = useState<number | null>(null);

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
      const currentIdentifier = isSignup ? email.trim() : identifier.trim();
      if (otpIdentifier && currentIdentifier === otpIdentifier && otpCooldownUntil && otpCooldownUntil > Date.now()) {
        setOtpOpen(true);
        setOtpSuccess("Continue with the OTP already sent to this account.");
        return;
      }

      const body = buildRequestPayload();
      const response = await apiRequest<RequestOtpResponse>("/auth/request-otp", {
        method: "POST",
        body,
      });

      setOtpIdentifier(currentIdentifier);
      setOtpCooldownUntil(Date.now() + (response.retryAfterSeconds ?? 45) * 1000);
      setOtpOpen(true);
      setOtpSuccess(
        response.reusedExisting
          ? "Use the OTP already sent. You can request a fresh code in a moment."
          : "OTP sent. Enter the code to continue.",
      );
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
    const response = await apiRequest<RequestOtpResponse>("/auth/request-otp", {
      method: "POST",
      body,
    });
    setOtpCooldownUntil(Date.now() + (response.retryAfterSeconds ?? 45) * 1000);
    setOtpSuccess(
      response.reusedExisting
        ? "Use the OTP already sent. A fresh resend will unlock when the timer ends."
        : "OTP resent. Check your inbox.",
    );
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleRequestOtp}
        className="space-y-5 rounded-[28px] border border-white/80 bg-white/90 p-7 shadow-[0_30px_70px_rgba(15,23,42,0.18)] backdrop-blur"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neutral-900 text-white shadow-[0_12px_30px_rgba(15,23,42,0.2)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 5v14" />
              <path d="M6 11l6 6 6-6" />
            </svg>
          </div>
          <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
            {isSignup ? "Create account" : "Welcome back"}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            {isSignup ? "Sign up with OTP" : "Sign in with OTP"}
          </h1>
          <p className="text-sm text-neutral-600">
            {isSignup
              ? "We’ll send a one-time code to create your account."
              : "We’ll send a one-time code to sign you in securely."}
          </p>
        </div>

        {isSignup ? (
          <>
            <Field
              label="Full name"
              placeholder="Aarav Sharma"
              value={fullName}
              onChange={(value) => setFullName(value)}
              icon="user"
            />
            <Field
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(value) => setEmail(value)}
              type="email"
              icon="mail"
            />
            <Field
              label="Mobile number"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(value) => setPhone(value)}
              type="tel"
              icon="phone"
            />
          </>
        ) : (
          <Field
            label="Email or mobile number"
            placeholder="you@example.com or +91 9876543210"
            value={identifier}
            onChange={(value) => setIdentifier(value)}
            icon="mail"
          />
        )}

        {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <Button
          type="submit"
          className="w-full rounded-xl bg-neutral-900 text-white shadow-[0_14px_30px_rgba(15,23,42,0.25)] hover:bg-neutral-800"
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
        cooldownUntil={otpCooldownUntil}
      />

      {otpIdentifier && !otpOpen ? (
        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white/80 p-4 text-sm text-neutral-600 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
          <p className="font-medium text-neutral-900">OTP session active for {otpIdentifier}</p>
          <p className="mt-1">If the OTP box was closed by mistake, reopen it and continue without requesting a new code.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setOtpError(null);
                setOtpOpen(true);
              }}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Continue OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setOtpOpen(false);
                setOtpIdentifier("");
                setOtpCooldownUntil(null);
                setOtpError(null);
                setOtpSuccess(null);
              }}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700"
            >
              Use another account
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  icon = "mail",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  icon?: "mail" | "phone" | "user";
}) {
  const iconPath =
    icon === "phone"
      ? "M6.2 3.6a1.5 1.5 0 0 1 1.7-.4l2.3.8a1.5 1.5 0 0 1 1 1.3l.2 2a1.5 1.5 0 0 1-.6 1.3l-1.5 1.1a12.8 12.8 0 0 0 5 5l1.1-1.5a1.5 1.5 0 0 1 1.3-.6l2 .2a1.5 1.5 0 0 1 1.3 1l.8 2.3a1.5 1.5 0 0 1-.4 1.7l-1.2 1.2a2 2 0 0 1-2 .5c-3.7-1.1-6.9-3.1-9.6-5.8-2.7-2.7-4.7-5.9-5.8-9.6a2 2 0 0 1 .5-2l1.2-1.2Z"
      : icon === "user"
      ? "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 9a7 7 0 0 1 14 0"
      : "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Zm2.2.8 5.6 4.2a2 2 0 0 0 2.4 0l5.6-4.2";

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-neutral-800">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d={iconPath} />
          </svg>
        </span>
        <Input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          placeholder={placeholder}
          className="h-11 rounded-xl bg-white pl-9 text-neutral-900 placeholder:text-neutral-400"
        />
      </div>
    </label>
  );
}
