import { ContentSkeleton } from "@/components/ui/ContentSkeleton";

export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_12%,rgba(255,226,202,0.7),transparent_50%),radial-gradient(circle_at_88%_10%,rgba(198,222,255,0.65),transparent_55%),linear-gradient(180deg,#f7f2eb_0%,#efe8df_100%)] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:gap-8">
        <ContentSkeleton rows={4} className="min-h-[720px] lg:w-[280px]" />
        <div className="flex-1 space-y-6">
          <ContentSkeleton rows={3} showAvatar={false} className="min-h-[110px]" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ContentSkeleton key={index} rows={3} className="min-h-[150px]" />
            ))}
          </div>
          <ContentSkeleton rows={4} showAvatar={false} className="min-h-[360px]" />
        </div>
      </div>
    </main>
  );
}
