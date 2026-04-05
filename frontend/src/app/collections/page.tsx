import Link from "next/link";

import { apiRequest } from "@/lib/api";
import type { CollectionCatalogResponse } from "@/types/collection";

async function getCollections() {
  try {
    return await apiRequest<CollectionCatalogResponse>("/collections?limit=40&page=1");
  } catch {
    return { collections: [], pagination: { page: 1, limit: 40, total: 0, totalPages: 1 } };
  }
}

export default async function CollectionsPage() {
  const data = await getCollections();

  return (
    <main className="collections-page">
      <div className="wrapper">
        {/* Hero */}
        <div className="page-hero">
          <div className="page-hero-inner">
            <nav className="page-breadcrumb">
              <Link href="/">Home</Link>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              <span>Collections</span>
            </nav>
            <p className="overline">Collections</p>
            <h1>Browse by Collection</h1>
            <p>Curated edits grouped by occasion, mood, season &#x2014; find your signature faster.</p>
          </div>
        </div>

        {/* Grid */}
        <div className="collections-grid" style={{ marginTop: 28 }}>
          {data.collections.length === 0 && (
            <div className="catalog-empty">
              <h3>No collections yet</h3>
              <p>Collections will appear here once added from the admin dashboard.</p>
            </div>
          )}
          {data.collections.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.slug}`} className="coll-card">
              <div className="coll-card-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={collection.imageUrl} alt={collection.name} />
              </div>
              <div className="coll-card-body">
                <h3>{collection.name}</h3>
                <p>{collection.description}</p>
                <div className="coll-card-meta">
                  <span className="coll-card-count">{collection.productCount} products</span>
                  <span className="coll-card-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
