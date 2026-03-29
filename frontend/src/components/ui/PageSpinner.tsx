export function PageSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[28px] border border-black/5 bg-white/80 p-10 shadow-[0_20px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm">
      <span className="h-12 w-12 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-700" />
      <p className="text-sm font-medium text-neutral-500">{label}</p>
    </div>
  );
}
