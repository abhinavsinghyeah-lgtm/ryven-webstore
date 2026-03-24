import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About RYVEN",
  description:
    "Learn about RYVEN's perfume philosophy, ingredient sourcing, and our story of building modern fragrances for youth culture.",
};

const values = [
  {
    title: "Modern Perfumery",
    text: "We design clean, expressive fragrances made for daily movement and real city life, not just occasion wear.",
  },
  {
    title: "Better Ingredients",
    text: "From neroli and tea accords to woods and musks, we blend high-impact notes with skin-friendly longevity.",
  },
  {
    title: "Transparent Pricing",
    text: "No inflated luxury markups. You pay for fragrance quality, not for heavy retail overhead.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <section className="grid gap-8 rounded-3xl border border-neutral-300 bg-white/70 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Our Story</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
            Crafted for a generation that moves fast.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-neutral-700 sm:text-lg">
            RYVEN was built to make contemporary perfumery feel personal again. We obsess over scent architecture,
            skin behavior in Indian weather, and packaging that feels elevated without shouting for attention.
          </p>
          <p className="mt-4 max-w-2xl text-base text-neutral-700">
            The goal is simple: signature fragrances that people remember, prices that still make sense, and an online
            shopping experience that is direct, beautiful, and trustworthy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white">
              Explore collections
            </Link>
            <Link href="/signup" className="rounded-full border border-neutral-400 px-5 py-2.5 text-sm font-semibold text-neutral-900">
              Join RYVEN
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-neutral-300">
          <Image
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1400&auto=format&fit=crop"
            alt="RYVEN studio fragrance composition"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
            priority
          />
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {values.map((value) => (
          <article key={value.title} className="rounded-2xl border border-neutral-300 bg-white/80 p-5">
            <h2 className="text-lg font-semibold text-neutral-900">{value.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">{value.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
