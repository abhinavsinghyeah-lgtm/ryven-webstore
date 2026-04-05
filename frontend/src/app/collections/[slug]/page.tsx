import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product/ProductCard";
import { apiRequest } from "@/lib/api";
import type { CollectionDetailResponse } from "@/types/collection";

async function getCollection(slug: string) {
  try {
    return await apiRequest<CollectionDetailResponse>(`/collections/${slug}`);
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
  const data = await getCollection(slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="collections-page">
      <div className="wrapper">
        {/* Breadcrumb */}
        <nav className="page-breadcrumb" style={{ paddingTop: 32 }}>
          <Link href="/">Home</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          <Link href="/collections">Collections</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          <span>{data.collection.name}</span>
        </nav>

        {/* Hero banner with image overlay */}
        <div className="coll-detail-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="coll-detail-hero-img"
            src={data.collection.imageUrl}
            alt={data.collection.name}
          />
          <div className="coll-detail-hero-overlay">
            <span className="coll-detail-count">{data.products.length} products</span>
            <h1>{data.collection.name}</h1>
            <p>{data.collection.description}</p>
          </div>
        </div>

        {/* Products grid */}
        {data.products.length === 0 ? (
          <div className="catalog-empty">
            <h3>No products yet</h3>
            <p>Products will appear here once they are added to this collection.</p>
          </div>
        ) : (
          <div className="catalog-grid">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
