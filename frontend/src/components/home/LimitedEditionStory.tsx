import Image from "next/image";
import Link from "next/link";

export function LimitedEditionStory() {
  return (
    <div className="min-h-screen border-b border-white/10 bg-[#08090b] px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto grid min-h-[80vh] w-full max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <div className="relative min-h-[58vh] overflow-hidden rounded-[2rem] border border-white/15">
          <Image
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1600&auto=format&fit=crop"
            alt="Limited edition fragrance story"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/55">Limited Edition Story</p>
          <h2 className="mt-3 font-display text-5xl text-white sm:text-6xl">Night ritual, bottled.</h2>
          <p className="mt-5 text-sm leading-relaxed text-white/75 sm:text-base">
            Inspired by post-midnight city silence, this line combines cold mineral sparkle with smoky resins. It is a
            scent built for confidence after sunset: intimate near-skin up close, memorable in the air when you move.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
            We compose each batch with a deliberate three-stage progression so the opening feels clean, the heart feels
            textured, and the dry-down feels addictive.
          </p>
          <Link href="/about" className="mt-7 inline-flex brand-btn-ghost">
            Read brand story
          </Link>
        </div>
      </div>
    </div>
  );
}
