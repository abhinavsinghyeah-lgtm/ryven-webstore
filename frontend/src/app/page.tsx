import { apiRequest } from "@/lib/api";
import { HeroSection } from "@/components/home/HeroSection";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { OccasionGridSection } from "@/components/home/OccasionGridSection";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { ProductGridSection } from "@/components/home/ProductGridSection";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { NotesExplorer } from "@/components/home/NotesExplorer";
import { BestsellersSection } from "@/components/home/BestsellersSection";
import { QuizCTA } from "@/components/home/QuizCTA";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { GuaranteesSection } from "@/components/home/GuaranteesSection";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { MobileStickyBar } from "@/components/home/MobileStickyBar";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import type { ProductCatalogResponse } from "@/types/product";
import type { CollectionCatalogResponse } from "@/types/collection";

async function getProducts() {
  try {
    return await apiRequest<ProductCatalogResponse>("/products?limit=6&page=1");
  } catch {
    return { products: [], pagination: { page: 1, limit: 6, total: 0, totalPages: 1 } };
  }
}

async function getFeaturedCollections() {
  try {
    return await apiRequest<CollectionCatalogResponse>("/collections?featured=true&limit=6&page=1");
  } catch {
    return { collections: [], pagination: { page: 1, limit: 6, total: 0, totalPages: 1 } };
  }
}

export default async function Home() {
  const [catalog, collections] = await Promise.all([getProducts(), getFeaturedCollections()]);

  return (
    <main className="bg-[var(--bg)]">
      <HeroSection />
      <BrandMarquee />
      <OccasionGridSection collections={collections.collections} />
      <FlashSaleSection />
      <ProductGridSection products={catalog.products} />
      <ProcessTimeline />
      <NotesExplorer />
      <BestsellersSection />
      <QuizCTA />
      <ReviewsSection />
      <GuaranteesSection />
      <NewsletterCTA />
      <MobileStickyBar />
      <ScrollReveal />
    </main>
  );
}
