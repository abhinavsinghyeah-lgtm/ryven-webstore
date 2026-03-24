import Image from "next/image";
import Link from "next/link";

export function LimitedEditionStory() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto grid min-h-[80vh] w-full max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative min-h-[58vh] overflow-hidden rounded-3xl border-2 border-white/40 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1600&auto=format&fit=crop"
            alt="Limited edition fragrance story"
            fill
            className="object-cover hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-pink-400/20" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-purple-600 font-bold">Limited Edition Story</p>
          <h2 className="mt-3 font-display text-5xl text-neutral-800 sm:text-6xl font-bold leading-tight">Night ritual, bottled.</h2>
          <p className="mt-6 text-sm leading-relaxed text-neutral-700 sm:text-base">
            Inspired by post-midnight city silence, this line combines cold mineral sparkle with smoky resins. It is a
            scent built for confidence after sunset: intimate near-skin up close, memorable in the air when you move.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-base">
            We compose each batch with a deliberate three-stage progression so the opening feels clean, the heart feels
            textured, and the dry-down feels addictive.
          </p>
          <Link href="/about" className="mt-8 inline-flex brand-btn-primary">
            Read brand story
          </Link>
        </div>
      </div>
    </div>
  );
}
