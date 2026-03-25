import { ContentSkeleton } from "@/components/ui/ContentSkeleton";

export default function ProductDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 sm:py-10">
      <div className="h-4 w-32 rounded-full bg-neutral-200" />
      <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
        <div className="min-h-[640px] rounded-xl bg-neutral-200" />
        <div className="space-y-5">
          <div className="h-4 w-16 rounded-full bg-neutral-200" />
          <div className="h-14 w-72 rounded-full bg-neutral-200" />
          <ContentSkeleton rows={4} className="min-h-[220px]" />
          <ContentSkeleton rows={3} showAvatar={false} showButton={true} className="min-h-[140px]" />
        </div>
      </section>
    </main>
  );
}
