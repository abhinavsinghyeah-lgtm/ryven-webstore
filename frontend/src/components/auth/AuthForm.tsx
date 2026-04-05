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

type Mode = "login" | "signup";
type AuthFormProps = { mode: Mode };

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
    <div className="auth-card-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <Link href="/">RYVEN</Link>
        </div>

        <div className="auth-heading">
          <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p>
            {isSignup
              ? "We'll send a one-time code to verify your identity."
              : "Sign in with a one-time code sent to your email."}
          </p>
        </div>

        <form onSubmit={handleRequestOtp} className="auth-form">
          {isSignup ? (
            <>
              <AuthField label="Full name" placeholder="Aarav Sharma" value={fullName} onChange={setFullName} icon="user" />
              <AuthField label="Email" placeholder="you@example.com" value={email} onChange={setEmail} type="email" icon="mail" />
              <AuthField label="Mobile number" placeholder="+91 9876543210" value={phone} onChange={setPhone} type="tel" icon="phone" />
            </>
          ) : (
            <AuthField label="Email or mobile number" placeholder="you@example.com or +91 9876543210" value={identifier} onChange={setIdentifier} icon="mail" />
          )}

          {error ? <div className="auth-error">{error}</div> : null}

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Continue"}
          </button>

          <p className="auth-switch">
            {isSignup ? "Already registered? " : "New to RYVEN? "}
            <Link href={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Sign in" : "Create account"}
            </Link>
          </p>
        </form>
      </div>

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
        <div className="auth-otp-banner">
          <p>OTP session active for {otpIdentifier}</p>
          <p>If the OTP box was closed by mistake, reopen it and continue without requesting a new code.</p>
          <div className="auth-otp-actions">
            <button type="button" className="otp-continue" onClick={() => { setOtpError(null); setOtpOpen(true); }}>
              Continue OTP
            </button>
            <button
              type="button"
              className="otp-switch"
              onClick={() => { setOtpOpen(false); setOtpIdentifier(""); setOtpCooldownUntil(null); setOtpError(null); setOtpSuccess(null); }}
            >
              Use another account
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AuthField({
  label, placeholder, value, onChange, type = "text", icon = "mail",
}: {
  label: string; placeholder: string; value: string;
  onChange: (value: string) => void; type?: "text" | "email" | "tel";
  icon?: "mail" | "phone" | "user";
}) {
  const iconPath =
    icon === "phone"
      ? "M6.2 3.6a1.5 1.5 0 0 1 1.7-.4l2.3.8a1.5 1.5 0 0 1 1 1.3l.2 2a1.5 1.5 0 0 1-.6 1.3l-1.5 1.1a12.8 12.8 0 0 0 5 5l1.1-1.5a1.5 1.5 0 0 1 1.3-.6l2 .2a1.5 1.5 0 0 1 1.3 1l.8 2.3a1.5 1.5 0 0 1-.4 1.7l-1.2 1.2a2 2 0 0 1-2 .5c-3.7-1.1-6.9-3.1-9.6-5.8-2.7-2.7-4.7-5.9-5.8-9.6a2 2 0 0 1 .5-2l1.2-1.2Z"
      : icon === "user"
      ? "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 9a7 7 0 0 1 14 0"
      : "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Zm2.2.8 5.6 4.2a2 2 0 0 0 2.4 0l5.6-4.2";

  return (
    <div className="auth-field">
      <label>{label}</label>
      <div className="auth-field-input">
        <span className="auth-field-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d={iconPath} />
          </svg>
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
