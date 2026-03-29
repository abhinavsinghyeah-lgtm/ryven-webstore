import { PageSpinner } from "@/components/ui/PageSpinner";

export default function ProductDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 sm:py-10">
      <PageSpinner label="Loading product details..." />
    </main>
  );
}
