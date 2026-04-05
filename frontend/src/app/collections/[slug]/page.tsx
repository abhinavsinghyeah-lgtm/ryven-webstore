import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product/ProductCard";
import { apiRequest } from "@/lib/api";
import type { ProductCatalogResponse } from "@/types/product";

const COLLECTIONS: Record<string, { name: string; description: string; image: string }> = {
  "date-night": {
    name: "Date Night",
    description: "Rich orientals and warm woods that leave a lasting impression. Set the mood with scents designed to linger.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop",
  },
  "summer-essentials": {
    name: "Summer Essentials",
    description: "Light, fresh, aquatic scents built for Indian summers. Stay cool and smell amazing.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
  },
  "office-ready": {
    name: "Office Ready",
    description: "Clean, sophisticated, never overpowering. Professional scents that earn compliments.",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop",
  },
  "wedding-season": {
    name: "Wedding Season",
    description: "Grand, luxurious fragrances for celebrations that matter. Be unforgettable.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  },
  "gift-sets": {
    name: "Gift Sets",
    description: "Beautifully packaged duos and trios for any occasion. Thoughtful gifts made easy.",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop",
  },
  "woody-collection": {
    name: "Woody Collection",
    description: "Cedarwood, sandalwood, oud — earthy warmth for depth lovers.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
  },
  "weekend-vibes": {
    name: "Weekend Vibes",
    description: "Relaxed, easy-going scents for laid-back days off. Effortless and fresh.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
  },
  "under-999": {
    name: "Under \u20B9999",
    description: "Premium quality doesn\u2019t have to break the bank. Luxury scents at everyday prices.",
    image: "https://images.unsplash.com/photo-1595425964272-fc617fa71096?q=80&w=1200&auto=format&fit=crop",
  },
  "travel-ready": {
    name: "Travel Ready",
    description: "Compact, long-lasting companions for every journey. Pack light, smell great.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop",
  },
  "gifting": {
    name: "Gifting",
    description: "Thoughtful fragrance gifts that always impress. Perfect for every occasion.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238f8e1?q=80&w=1200&auto=format&fit=crop",
  },
};

async function getProducts() {
  try {
    return await apiRequest<ProductCatalogResponse>("/products?limit=40");
  } catch {
    return null;
  }
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = COLLECTIONS[slug];

  if (!collection) notFound();

  const data = await getProducts();
  const products = data?.products ?? [];

  return (
    <main className="collections-page">
      <div className="wrapper">
        <nav className="page-breadcrumb" style={{ paddingTop: 32 }}>
          <Link href="/">Home</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          <Link href="/collections">Collections</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          <span>{collection.name}</span>
        </nav>

        <div className="coll-detail-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="coll-detail-hero-img" src={collection.image} alt={collection.name} />
          <div className="coll-detail-hero-overlay">
            <span className="coll-detail-count">{products.length} products</span>
            <h1>{collection.name}</h1>
            <p>{collection.description}</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="catalog-empty">
            <h3>No products yet</h3>
            <p>Products will appear here once they are added to this collection.</p>
          </div>
        ) : (
          <div className="catalog-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
