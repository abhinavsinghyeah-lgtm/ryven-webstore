"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";

type OTPDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  identifierLabel: string;
  identifierValue: string;
  otpLength?: number;
  cooldownSeconds?: number;
  cooldownUntil?: number | null;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
};

export default function OTPDialog({
  open,
  onOpenChange,
  identifierLabel,
  identifierValue,
  otpLength = 6,
  cooldownSeconds = 45,
  cooldownUntil,
  onVerify,
  onResend,
  loading = false,
  error,
  success,
}: OTPDialogProps) {
  const [otp, setOtp] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(cooldownSeconds);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!open) return;
    setOtp(Array.from({ length: otpLength }, () => ""));
    setMessage("");
    const nextTimeLeft = cooldownUntil ? Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000)) : cooldownSeconds;
    setTimeLeft(nextTimeLeft);
    setCanResend(nextTimeLeft <= 0);
    setTimeout(() => inputRefs.current[0]?.focus(), 80);
  }, [open, otpLength, cooldownSeconds, cooldownUntil]);

  useEffect(() => {
    if (!open) return;
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, open]);

  /* Prevent body scroll when modal open */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const applyDigits = (startIndex: number, digits: string) => {
    if (!digits) return;
    const updated = [...otp];
    let writeIndex = startIndex;
    for (const digit of digits) {
      if (writeIndex >= updated.length) break;
      updated[writeIndex] = digit;
      writeIndex += 1;
    }
    setOtp(updated);
    const nextIndex = Math.min(writeIndex, updated.length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleChange = (value: string, index: number) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      const updated = [...otp];
      updated[index] = "";
      setOtp(updated);
      return;
    }
    if (digits.length === 1) {
      const updated = [...otp];
      updated[index] = digits;
      setOtp(updated);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      return;
    }
    applyDigits(index, digits);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const updated = [...otp];
      if (updated[index]) {
        updated[index] = "";
        setOtp(updated);
        return;
      }
      if (index > 0) {
        updated[index - 1] = "";
        setOtp(updated);
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < otp.length - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    applyDigits(index, pasted);
  };

  const handleVerify = async () => {
    if (otp.some((d) => d === "")) {
      setMessage("Please enter the complete code.");
      return;
    }
    setMessage("");
    await onVerify(otp.join(""));
  };

  const handleResend = async () => {
    await onResend();
    setMessage("OTP has been resent.");
    setOtp(Array.from({ length: otpLength }, () => ""));
    setTimeLeft(cooldownSeconds);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const feedback = useMemo(() => {
    if (error) return error;
    if (success) return success;
    if (message) return message;
    return "";
  }, [error, success, message]);

  if (!open) return null;

  return (
    <div className="otp-backdrop">
      <div className="otp-modal">
        <button type="button" className="otp-close" onClick={() => onOpenChange(false)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className="otp-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a4 4 0 00-4 4v2h8V6a4 4 0 00-4-4z" />
            <rect x="5" y="10" width="14" height="12" rx="2" />
            <circle cx="12" cy="16" r="1.5" />
          </svg>
        </div>

        <h2 className="otp-title">Verify your identity</h2>
        <p className="otp-desc">
          Enter the {otpLength}-digit code sent to<br />
          <strong>{identifierValue}</strong>
        </p>

        <div className="otp-inputs">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              autoComplete={idx === 0 ? "one-time-code" : undefined}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={(e) => handlePaste(e, idx)}
              className={`otp-digit${digit ? " filled" : ""}`}
              ref={(el) => { inputRefs.current[idx] = el; }}
            />
          ))}
        </div>

        <div className="otp-timer">
          {canResend
            ? <button type="button" className="otp-resend-btn" onClick={handleResend} disabled={loading}>Resend Code</button>
            : <span>Resend in <strong>{formatTime(timeLeft)}</strong></span>
          }
        </div>

        <button type="button" className="otp-verify-btn" onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <button type="button" className="otp-hide-btn" onClick={() => onOpenChange(false)}>
          Hide for now
        </button>

        {feedback && (
          <div className={`otp-feedback${error ? " error" : ""}`}>{feedback}</div>
        )}
      </div>
    </div>
  );
}
