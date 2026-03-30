import { HeroBannerSection } from "@/components/home/HeroBannerSection";
import { ImageWithTextSection } from "@/components/home/ImageWithTextSection";
import { ProductCollectionSection } from "@/components/home/ProductCollectionSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import type { StoreSettings } from "@/types/auth";
import type { Product } from "@/types/product";
import type { ThemeConfig, ThemeSection } from "@/types/theme";
import { normalizeThemeConfig } from "@/lib/theme-editor";

type ThemePageRendererProps = {
  settings: StoreSettings | null;
  products: Product[];
  themeConfig?: ThemeConfig | null;
};

function renderSection(section: ThemeSection, settings: StoreSettings | null, products: Product[]) {
  switch (section.type) {
    case "hero":
      return <HeroBannerSection settings={settings} config={section.settings} />;
    case "featured-collection":
      return <ProductCollectionSection products={products} config={section.settings} />;
    case "testimonials":
      return <TestimonialsSection products={products} config={section.settings} />;
    case "image-with-text":
      return <ImageWithTextSection config={section.settings} />;
    default:
      return null;
  }
}

export function ThemePageRenderer({ settings, products, themeConfig }: ThemePageRendererProps) {
  const normalized = normalizeThemeConfig(themeConfig || settings?.themeConfig);
  const activeSections = normalized.home.sections.filter((section) => section.enabled);

  return (
    <>
      {activeSections.map((section) => (
        <div key={section.id}>{renderSection(section, settings, products)}</div>
      ))}
    </>
  );
}
