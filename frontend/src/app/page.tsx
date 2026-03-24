import { apiRequest } from "@/lib/api";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { LimitedEditionStory } from "@/components/home/LimitedEditionStory";
import { OccasionScroller } from "@/components/home/OccasionScroller";
import { PremiumHero } from "@/components/home/PremiumHero";
import { ScarcitySection } from "@/components/home/ScarcitySection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
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
  const primary = catalog.products[0] ?? null;
  const secondary = catalog.products[1] ?? null;
  const scarcityPick = catalog.products[2] ?? primary;

  return (
    <main className="-mt-[64px] bg-white">
      <PremiumHero product={primary} />

      <RevealOnScroll>
        <OccasionScroller />
      </RevealOnScroll>

      <RevealOnScroll>
        <CategoryShowcase products={catalog.products} />
      </RevealOnScroll>

      <RevealOnScroll>
        <FeaturedCollection primary={primary} secondary={secondary} />
      </RevealOnScroll>

      <RevealOnScroll>
        <LimitedEditionStory />
      </RevealOnScroll>

      <RevealOnScroll>
        <ScarcitySection product={scarcityPick} stockLeft={17} />
      </RevealOnScroll>

      <RevealOnScroll>
        <TestimonialsSection products={catalog.products} />
      </RevealOnScroll>
    </main>
  );
}
