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
import { apiRequest } from "@/lib/api";
import type { ProductCatalogResponse } from "@/types/product";

async function getProducts() {
  try {
    return await apiRequest<ProductCatalogResponse>("/products?limit=12");
  } catch {
    return null;
  }
}

export default async function Home() {
  const data = await getProducts();
  const products = data?.products ?? [];

  return (
    <main>
      <HeroSection />
      <BrandMarquee />
      <OccasionGridSection />
      <FlashSaleSection />
      <ProductGridSection products={products} />
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
