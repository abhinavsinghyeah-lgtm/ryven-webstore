import { ContentSkeleton } from "@/components/ui/ContentSkeleton";

export default function ProductsLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="h-3 w-20 rounded-full bg-neutral-200" />
            <div className="h-10 w-64 rounded-full bg-neutral-200" />
            <div className="h-3 w-48 rounded-full bg-neutral-200" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 rounded-full bg-neutral-200" />
            <div className="h-10 w-32 rounded-full bg-neutral-200" />
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ContentSkeleton key={index} rows={4} className="min-h-[360px]" />
        ))}
      </section>
    </main>
  );
}
