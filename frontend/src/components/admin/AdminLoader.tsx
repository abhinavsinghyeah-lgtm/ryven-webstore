"use client";

export function AdminLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-white/5 bg-[#151c26]">
      <div className="flex items-center gap-3 text-white/70">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}
