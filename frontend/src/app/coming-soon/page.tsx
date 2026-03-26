"use client";

import { useState } from "react";
import Link from "next/link";

export default function ComingSoonPage() {
  const [password, setPassword] = useState("");
  const [showAccess, setShowAccess] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Incorrect password");
      }

      window.location.href = "/";
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0c10] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2937_0%,transparent_45%),radial-gradient(circle_at_20%_30%,#111827_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#0f172a_0%,transparent_50%)]" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
          <header className="flex w-full items-center justify-between">
            <span className="text-sm font-semibold tracking-[0.3em]">RYVEN</span>
            <span className="text-xs uppercase tracking-[0.4em] text-white/60">Coming Soon</span>
            <Link
              href="https://shop.ryven.in"
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Visit Shop
            </Link>
          </header>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Our new experience is almost ready.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/70 sm:text-lg">
            We are polishing the final details of the RYVEN store. Until then, you can shop the current collection on{" "}
            <Link href="https://shop.ryven.in" className="font-semibold text-white underline decoration-white/50 underline-offset-4">
              shop.ryven.in
            </Link>
            .
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowAccess(true)}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0b0c10] transition hover:bg-white/90"
              >
                Request Access
              </button>
              <Link
                href="https://shop.ryven.in"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Visit Shopify Store
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.24em] text-white/40">
              <span>Modern fragrance house</span>
              <span>Launching soon</span>
              <span>RYVEN</span>
            </div>
          </div>
        </div>
      </div>

      {showAccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f1117] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Private access</h2>
              <button
                type="button"
                onClick={() => setShowAccess(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60"
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-sm text-white/60">
              Enter the access code to preview the full website.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Access code"
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none transition focus:border-white/40"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-12 w-full rounded-2xl bg-white text-sm font-semibold text-[#0b0c10] transition hover:bg-white/90 disabled:opacity-60"
              >
                {status === "loading" ? "Checking..." : "Unlock Site"}
              </button>
            </form>

            {status === "error" && message ? (
              <p className="mt-3 text-xs text-rose-200">{message}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
