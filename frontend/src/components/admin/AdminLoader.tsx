"use client";

export function AdminLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="adm-loader">
      <span className="adm-spinner" />
      <span>{label}</span>
    </div>
  );
}
