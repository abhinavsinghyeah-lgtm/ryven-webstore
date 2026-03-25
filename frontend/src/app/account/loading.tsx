import { ContentSkeleton } from "@/components/ui/ContentSkeleton";

export default function AccountLoading() {
  return (
    <main className="min-h-screen bg-[#f7f6ff] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <ContentSkeleton rows={4} className="min-h-[720px]" />
        <div className="space-y-6">
          <ContentSkeleton rows={3} showAvatar={false} className="min-h-[96px]" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <ContentSkeleton key={index} rows={3} className="min-h-[140px]" />)}
          </div>
          <ContentSkeleton rows={4} showAvatar={false} className="min-h-[420px]" />
        </div>
      </div>
    </main>
  );
}
