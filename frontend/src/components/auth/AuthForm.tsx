"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCart } from "@/contexts/CartContext";
import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { syncGuestCartAfterLogin } from "@/lib/cart-sync";
import type { AuthResponse } from "@/types/auth";

type Mode = "login" | "signup";

type AuthFormProps = {
  mode: Mode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { refreshCart } = useCart();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isSignup = mode === "signup";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const path = isSignup ? "/auth/signup" : "/auth/login";
      const body = isSignup
        ? { fullName: fullName.trim(), email: email.trim(), password }
        : { email: email.trim(), password };

      const response = await apiRequest<AuthResponse>(path, {
        method: "POST",
        body,
      });

      authStorage.saveAuth(response);
      await syncGuestCartAfterLogin();
      await refreshCart();
      setSuccess(isSignup ? "Account created. You are logged in." : "Welcome back. Logged in.");
      router.push(response.user.role === "admin" ? "/admin" : "/account");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Something went wrong";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-neutral-300 bg-white/90 p-6 shadow-[0_10px_40px_-25px_rgba(0,0,0,0.4)] backdrop-blur">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {isSignup ? "Create your RYVEN account" : "Sign in to RYVEN"}
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          {isSignup ? "Start your scent journey." : "Access your account and orders."}
        </p>
      </div>

      {isSignup && (
        <label className="block space-y-2">
          <span className="text-sm font-medium text-neutral-800">Full name</span>
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
            minLength={2}
            className="h-11 w-full rounded-xl border border-neutral-300 px-3 outline-none transition focus:border-neutral-800"
            placeholder="Aarav Sharma"
          />
        </label>
      )}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-neutral-800">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="h-11 w-full rounded-xl border border-neutral-300 px-3 outline-none transition focus:border-neutral-800"
          placeholder="you@example.com"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-neutral-800">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          className="h-11 w-full rounded-xl border border-neutral-300 px-3 outline-none transition focus:border-neutral-800"
          placeholder="At least 8 characters"
        />
      </label>

      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-xl bg-neutral-900 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
      </button>

      <p className="text-sm text-neutral-600">
        {isSignup ? "Already registered? " : "New to RYVEN? "}
        <Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-neutral-900 underline decoration-2 underline-offset-4">
          {isSignup ? "Sign in" : "Create account"}
        </Link>
      </p>
    </form>
  );
}
