export default function AccountLoading() {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-sm text-neutral-500">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
        Loading account...
      </div>
    </div>
  );
}
