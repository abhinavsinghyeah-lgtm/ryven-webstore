import Image from "next/image";
import Link from "next/link";

import { AnimatedAddToCartButton } from "@/components/ui/AnimatedAddToCartButton";
import { formatPricePaise } from "@/lib/format";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1200&auto=format&fit=crop";

export function ProductCard({ product }: ProductCardProps) {
  const notes = Array.isArray(product.notes)
    ? product.notes.filter((note) => note.trim().length > 1).slice(0, 3)
    : [];

  return (
    <article className="pcard">
      <Link href={`/products/${product.slug}`}>
        <div className="pcard-img">
          <Image
            src={product.imageUrl || fallbackImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            style={{ objectFit: "cover" }}
          />
          {product.category && (
            <span className="pcard-tag">{product.category}</span>
          )}
        </div>
      </Link>

      <div className="pcard-body">
        <Link href={`/products/${product.slug}`}>
          <span className="pcard-cat">{product.category}</span>
          <h3>{product.name}</h3>
          <p className="pcard-desc">{product.shortDescription}</p>
        </Link>

        {notes.length > 0 && (
          <div className="pcard-notes">
            {notes.map((note) => (
              <span key={note} className="pcard-note">{note}</span>
            ))}
          </div>
        )}

        <div className="pcard-bottom">
          <span className="pcard-price">
            {formatPricePaise(product.pricePaise, product.currency)}
          </span>
          <AnimatedAddToCartButton
            className="pcard-action"
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              imageUrl: product.imageUrl || fallbackImage,
              pricePaise: product.pricePaise,
              currency: product.currency,
            }}
          />
        </div>
      </div>
    </article>
  );
}
