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
    <main className="cs-page">
      <div className="cs-bg">
        <div className="cs-blob cs-blob-1" />
        <div className="cs-blob cs-blob-2" />
      </div>

      <div className="cs-container">
        <header className="cs-header">
          <Link href="/" className="cs-brand">RYVEN</Link>
          <span className="cs-badge">Coming Soon</span>
        </header>

        <div className="cs-hero">
          <p className="cs-label">A NEW CHAPTER IN FRAGRANCE</p>
          <h1 className="cs-title">
            Something <em>extraordinary</em><br />is on its way.
          </h1>
          <p className="cs-desc">
            We&rsquo;re crafting a new experience for RYVEN.
            Until then, explore the current collection.
          </p>

          <div className="cs-actions">
            <button type="button" className="cs-btn-primary" onClick={() => setShowAccess(true)}>
              Early Access
            </button>
            <Link href="https://shopify.ryven.in" className="cs-btn-outline">
              Shop Now
            </Link>
          </div>
        </div>

        <footer className="cs-footer">
          <span>RYVEN PERFUMES</span>
          <span className="cs-dot" />
          <span>Modern Fragrance House</span>
        </footer>
      </div>

      {showAccess && (
        <div className="cs-modal-backdrop" onClick={() => setShowAccess(false)}>
          <div className="cs-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="cs-modal-close" onClick={() => setShowAccess(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>

            <div className="cs-modal-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
            </div>
            <h2 className="cs-modal-title">Private Access</h2>
            <p className="cs-modal-desc">Enter the access code to preview the full website.</p>

            <form onSubmit={handleSubmit} className="cs-modal-form">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access code"
                className="cs-modal-input"
                autoFocus
              />
              <button type="submit" className="cs-modal-submit" disabled={status === "loading"}>
                {status === "loading" ? "Checking..." : "Unlock"}
              </button>
            </form>

            {status === "error" && message && (
              <p className="cs-modal-error">{message}</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
