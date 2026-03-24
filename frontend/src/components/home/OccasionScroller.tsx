import Image from "next/image";

const occasionItems = [
  {
    title: "Everyday",
    caption: "Soft clean confidence for all-day wear",
    imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Fresh Summer",
    caption: "Citrus-heavy and breezy tropical trails",
    imageUrl: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Partywear",
    caption: "Projection-first notes for night movement",
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Universal Choice",
    caption: "Versatile, compliment-ready signature",
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1400&auto=format&fit=crop",
  },
];

export function OccasionScroller() {
  return (
    <div className="min-h-screen border-b border-white/10 bg-[#08090b] px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/55">Shop by Occasion</p>
          <h2 className="mt-3 font-display text-5xl text-white sm:text-6xl">Choose the mood first</h2>
          <p className="mt-3 text-sm text-white/65 sm:text-base">
            Not all days smell the same. Pick your scene and build a scent wardrobe around moments.
          </p>
        </div>

        <div className="-mx-5 mt-8 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
          <div className="flex min-w-max snap-x snap-mandatory gap-4">
            {occasionItems.map((item) => (
              <article
                key={item.title}
                className="group relative h-[62vh] min-w-[76vw] snap-center overflow-hidden rounded-3xl border border-white/15 bg-black/30 sm:min-w-[52vw] lg:min-w-[34vw]"
              >
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-[1.06]" sizes="(max-width: 1024px) 80vw, 36vw" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/65" />
                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-black/45 p-4 shadow-[0_0_35px_rgba(255,255,255,0.08)] backdrop-blur">
                  <h3 className="font-display text-3xl text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/75">{item.caption}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
