import Image from "next/image";

const occasionItems = [
  {
    title: "Everyday",
    caption: "Soft clean confidence for all-day wear",
    color: "from-rose-200 to-pink-200",
    imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Fresh Summer",
    caption: "Citrus-heavy and breezy tropical trails",
    color: "from-yellow-100 to-orange-200",
    imageUrl: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Partywear",
    caption: "Projection-first notes for night movement",
    color: "from-purple-200 to-pink-200",
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Universal Choice",
    caption: "Versatile, compliment-ready signature",
    color: "from-blue-200 to-cyan-200",
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1400&auto=format&fit=crop",
  },
];

export function OccasionScroller() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-purple-50 px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-purple-600 font-bold">Shop by Occasion</p>
          <h2 className="mt-3 font-display text-5xl text-neutral-800 sm:text-6xl font-bold leading-tight">Choose the mood first</h2>
          <p className="mt-3 text-sm text-neutral-600 sm:text-base">
            Not all days smell the same. Pick your scene and build a scent wardrobe around moments.
          </p>
        </div>

        <div className="-mx-5 mt-10 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
          <div className="flex min-w-max snap-x snap-mandatory gap-6">
            {occasionItems.map((item) => (
              <article
                key={item.title}
                className="group relative h-[62vh] min-w-[76vw] snap-center overflow-hidden rounded-3xl bg-gradient-to-br shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] sm:min-w-[52vw] lg:min-w-[34vw]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-40`} />
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-[1.08] mix-blend-overlay" sizes="(max-width: 1024px) 80vw, 36vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
                
                <div className="absolute inset-x-4 bottom-4 rounded-2xl border-2 border-white/50 bg-white/80 backdrop-blur-md p-5 shadow-lg">
                  <h3 className="font-display text-3xl text-neutral-800 font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{item.caption}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
