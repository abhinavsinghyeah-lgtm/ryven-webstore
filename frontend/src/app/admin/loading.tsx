import { ContentSkeleton } from "@/components/ui/ContentSkeleton";

export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-[#f5f7ff] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <ContentSkeleton rows={4} className="min-h-[720px]" />
        <div className="space-y-6">
          <ContentSkeleton rows={3} showAvatar={false} className="min-h-[96px]" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => <ContentSkeleton key={index} rows={3} className="min-h-[150px]" />)}
          </div>
          <ContentSkeleton rows={4} showAvatar={false} className="min-h-[360px]" />
        </div>
      </div>
    </main>
  );
}
