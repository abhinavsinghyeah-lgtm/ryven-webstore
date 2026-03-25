import { ContentSkeleton } from "@/components/ui/ContentSkeleton";

export default function CheckoutLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="mb-6 h-16 rounded-2xl bg-emerald-100" />
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <ContentSkeleton rows={4} showAvatar={false} showButton={true} className="min-h-[420px]" />
        <ContentSkeleton rows={4} className="min-h-[420px]" />
      </div>
    </main>
  );
}
