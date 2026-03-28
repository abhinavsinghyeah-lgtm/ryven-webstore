"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type OTPDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  identifierLabel: string;
  identifierValue: string;
  otpLength?: number;
  cooldownSeconds?: number;
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
    setTimeLeft(cooldownSeconds);
    setCanResend(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 80);
  }, [open, otpLength, cooldownSeconds]);

  useEffect(() => {
    if (!open) return;
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, open]);

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
      setMessage("⚠️ Please enter the complete OTP.");
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
    document.getElementById("otp-0")?.focus();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const feedback = useMemo(() => {
    if (error) return error;
    if (success) return success;
    if (message) return message;
    return "";
  }, [error, success, message]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm !rounded-xl p-6">
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-lg font-semibold">OTP Verification</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Enter the {otpLength}-digit code sent to <strong>{identifierValue}</strong>.
          </DialogDescription>
        </DialogHeader>

        <p className="text-center text-xs text-muted-foreground mb-4">
          Step 1 of 1: Verify your account
        </p>

        <div className="flex justify-center gap-3 mb-4">
          {otp.map((digit, idx) => (
            <Input
              key={idx}
              id={`otp-${idx}`}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(event) => handleKeyDown(event, idx)}
              onPaste={(event) => handlePaste(event, idx)}
              className="w-12 h-12 text-center text-lg font-medium rounded-md border border-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              maxLength={1}
              inputMode="numeric"
              autoComplete={idx === 0 ? "one-time-code" : undefined}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
            />
          ))}
        </div>

        {!canResend && (
          <p className="text-center text-xs text-muted-foreground mb-2">
            You can resend OTP in <strong>{formatTime(timeLeft)}</strong>
          </p>
        )}

        <div className="flex flex-col gap-2">
          <Button
            className="w-full rounded-xl bg-neutral-900 text-white shadow-[0_10px_20px_rgba(15,23,42,0.2)] hover:bg-neutral-800"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <Button
            variant="outline"
            className="w-full flex justify-between items-center rounded-xl border border-neutral-200 bg-white/70 text-neutral-800 hover:bg-white"
            onClick={handleResend}
            disabled={!canResend || loading}
          >
            {canResend ? "Send Again" : "Resend OTP"}
            {!canResend && <span className="text-xs text-muted-foreground">{formatTime(timeLeft)}</span>}
          </Button>
        </div>

        {feedback ? (
          <p className="mt-3 text-center text-sm text-muted-foreground">{feedback}</p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
