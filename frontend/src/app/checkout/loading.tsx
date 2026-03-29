import { PageSpinner } from "@/components/ui/PageSpinner";

export default function CheckoutLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <PageSpinner label="Preparing checkout..." />
    </main>
  );
}
