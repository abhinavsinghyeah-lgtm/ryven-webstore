import { apiRequest } from "@/lib/api";
import { HeroBannerSection } from "@/components/home/HeroBannerSection";
import { ProductCollectionSection } from "@/components/home/ProductCollectionSection";
import type { ProductCatalogResponse } from "@/types/product";
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

export default async function Home() {
  const [settings, catalog] = await Promise.all([getStoreSettings(), getProducts()]);

  return (
    <main className="-mt-[64px] bg-white">
      <HeroBannerSection settings={settings} spotlight={catalog.products[0] ?? null} />
      <ProductCollectionSection products={catalog.products} />
    </main>
  );
}
