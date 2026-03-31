import { apiRequest } from "@/lib/api";
import { HeroBannerSection } from "@/components/home/HeroBannerSection";
import { ProductCollectionSection } from "@/components/home/ProductCollectionSection";
import { ShopByOccasionSection } from "@/components/home/ShopByOccasionSection";
import type { ProductCatalogResponse } from "@/types/product";
import type { CollectionCatalogResponse } from "@/types/collection";
import type { StoreSettings } from "@/types/auth";

async function getStoreSettings() {
  try {
    const response = await apiRequest<{ settings: StoreSettings }>("/store-settings");
    return response.settings;
  } catch {
    return null;
  }
}

async function getProducts() {
  try {
    return await apiRequest<ProductCatalogResponse>("/products?limit=6&page=1");
  } catch {
    return { products: [], pagination: { page: 1, limit: 6, total: 0, totalPages: 1 } };
  }
}

async function getFeaturedCollections() {
  try {
    return await apiRequest<CollectionCatalogResponse>("/collections?featured=true&limit=4&page=1");
  } catch {
    return { collections: [], pagination: { page: 1, limit: 4, total: 0, totalPages: 1 } };
  }
}

export default async function Home() {
  const [settings, catalog, collections] = await Promise.all([getStoreSettings(), getProducts(), getFeaturedCollections()]);

  return (
    <main className="-mt-[64px] bg-white">
      <ShopByOccasionSection collections={collections.collections} />
      <HeroBannerSection settings={settings} />
      <ProductCollectionSection products={catalog.products} />
    </main>
  );
}
