import Link from "next/link";
import Image from "next/image";
import type { StoreSettings } from "@/types/auth";

type StoreHeroProps = {
  settings: StoreSettings | null;
};

export function StoreHero({ settings }: StoreHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-neutral-300 bg-[radial-gradient(circle_at_10%_10%,#f7f7f7_0%,#ececec_35%,#e6e6e6_100%)] p-6 sm:p-10">
      <div className="absolute -right-24 top-10 h-48 w-48 rotate-12 rounded-full bg-neutral-900/10 blur-2xl" />
      <div className="absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-white/70 blur-xl" />

      <div className="relative z-10 grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Perfume / Contemporary</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
            {settings?.storeName ?? "RYVEN"}
          </h1>
          <p className="mt-4 max-w-lg text-base text-neutral-700 sm:text-lg">
            {settings?.tagline ?? "Scent design for people who move fast and leave memory behind."}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/signup" className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700">
              Join now
            </Link>
            <Link href="/login" className="rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100">
              Sign in
            </Link>
          </div>
        </div>

        <div className="flex md:justify-end">
          <div className="w-full max-w-[240px] overflow-hidden rounded-2xl border border-neutral-300 bg-white p-3 shadow-[0_12px_30px_-20px_rgba(0,0,0,0.5)]">
            <Image
              src={settings?.logoUrl || "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=900&auto=format&fit=crop"}
              alt="Store visual"
              width={900}
              height={700}
              className="h-48 w-full rounded-xl object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
