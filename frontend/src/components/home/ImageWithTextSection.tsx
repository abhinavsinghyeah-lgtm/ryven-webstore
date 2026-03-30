import Image from "next/image";
import Link from "next/link";

type ImageWithTextSectionProps = {
  config?: Record<string, string | number | boolean | null | undefined>;
};

export function ImageWithTextSection({ config }: ImageWithTextSectionProps) {
  const eyebrow = String(config?.eyebrow || "Brand story");
  const title = String(config?.title || "Image with text");
  const body = String(config?.body || "Add a flexible storytelling block from the theme editor.");
  const buttonLabel = String(config?.buttonLabel || "Learn more");
  const buttonHref = String(config?.buttonHref || "/about");
  const imageUrl =
    String(config?.imageUrl || "") ||
    "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1800&auto=format&fit=crop";
  const imagePosition = String(config?.imagePosition || "right");
  const backgroundColor = String(config?.backgroundColor || "#ffffff");
  const textColor = String(config?.textColor || "#111827");
  const paddingTop = Number(config?.paddingTop || 48);
  const paddingBottom = Number(config?.paddingBottom || 48);

  const imageBlock = (
    <div className="relative min-h-[320px] overflow-hidden rounded-[32px] bg-neutral-200">
      <Image src={imageUrl} alt={title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
    </div>
  );

  return (
    <section style={{ backgroundColor, paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` }}>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        {imagePosition === "left" ? imageBlock : null}
        <div style={{ color: textColor }}>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] opacity-60">{eyebrow}</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{title}</h2>
          <p className="mt-4 max-w-xl text-base leading-8 opacity-75">{body}</p>
          <Link
            href={buttonHref}
            className="mt-8 inline-flex rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            {buttonLabel}
          </Link>
        </div>
        {imagePosition !== "left" ? imageBlock : null}
      </div>
    </section>
  );
}
