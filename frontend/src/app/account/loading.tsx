export default function AccountLoading() {
  return (
    <main className="min-h-screen bg-[#f7f7f8] px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[240px_1fr]">
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <Spinner label="Loading account..." />
        </div>
        <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <Spinner label="Preparing dashboard..." />
        </div>
      </div>
    </main>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-sm text-neutral-500">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      {label}
    </div>
  );
}
