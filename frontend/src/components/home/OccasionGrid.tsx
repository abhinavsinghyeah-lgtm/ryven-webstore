import Image from "next/image";

const occasions = [
  {
    title: "Everyday",
    imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?q=80&w=1200&auto=format&fit=crop",
    description: "Clean and confident for day-long wear.",
  },
  {
    title: "Fresh Summer",
    imageUrl: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?q=80&w=1200&auto=format&fit=crop",
    description: "Citrus and airy notes for warm weather.",
  },
  {
    title: "Partywear",
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
    description: "Projection-first profiles with bold dry-down.",
  },
  {
    title: "Universal Choice",
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop",
    description: "Versatile signatures that fit any setting.",
  },
];

export function OccasionGrid() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Shop by Occasion</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">Find your vibe</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 sm:text-base">
          From effortless daily signatures to high-energy night scents, discover blends that match the mood of your moment.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {occasions.map((occasion) => (
          <article key={occasion.title} className="group overflow-hidden rounded-2xl border border-neutral-300 bg-white/85">
            <div className="relative h-72 overflow-hidden">
              <Image src={occasion.imageUrl} alt={occasion.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 50vw, 25vw" />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold tracking-tight text-neutral-900">{occasion.title}</h3>
              <p className="mt-1 text-sm text-neutral-700">{occasion.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
