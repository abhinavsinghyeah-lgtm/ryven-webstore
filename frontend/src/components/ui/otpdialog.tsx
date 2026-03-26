"use client";

import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    if (!open) return;
    setOtp(Array.from({ length: otpLength }, () => ""));
    setMessage("");
    setTimeLeft(cooldownSeconds);
    setCanResend(false);
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

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const updated = [...otp];
      updated[index] = value;
      setOtp(updated);
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
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
              className="w-12 h-12 text-center text-lg font-medium rounded-md border border-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              maxLength={1}
              inputMode="numeric"
              autoComplete={idx === 0 ? "one-time-code" : undefined}
            />
          ))}
        </div>

        {!canResend && (
          <p className="text-center text-xs text-muted-foreground mb-2">
            You can resend OTP in <strong>{formatTime(timeLeft)}</strong>
          </p>
        )}

        <div className="flex flex-col gap-2">
          <Button className="w-full" onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <Button
            variant="outline"
            className="w-full flex justify-between items-center"
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
