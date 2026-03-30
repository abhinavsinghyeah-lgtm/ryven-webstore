import type { ThemeConfig, ThemeSection, ThemeSectionType } from "@/types/theme";

export const sectionTypeLabels: Record<ThemeSectionType, string> = {
  hero: "Hero",
  "featured-collection": "Featured collection",
  testimonials: "Testimonials",
  "image-with-text": "Image with text",
};

export const createDefaultThemeConfig = (): ThemeConfig => ({
  home: {
    sections: [
      {
        id: "hero-main",
        type: "hero",
        enabled: true,
        settings: {
          eyebrow: "RYVEN",
          title: "Modern fragrance, shaped for everyday rituals.",
          subtitle: "A storefront that feels editorial, clean, and unmistakably yours.",
          buttonLabel: "Shop collection",
          buttonHref: "/products",
          minHeight: "100",
          overlayOpacity: 38,
          contentAlign: "left",
          objectPosition: "center",
          textColor: "#ffffff",
          imageUrl: "",
        },
      },
      {
        id: "featured-collection-main",
        type: "featured-collection",
        enabled: true,
        settings: {
          eyebrow: "Collection",
          title: "All Live Products",
          subtitle: "Curated fragrances, crafted to feel modern and unmistakably premium.",
          ctaLabel: "View full catalog",
          ctaHref: "/products",
          backgroundColor: "#f7f5f2",
          textColor: "#111827",
          maxItems: 6,
          columnsDesktop: 3,
          paddingTop: 56,
          paddingBottom: 64,
        },
      },
      {
        id: "image-with-text-story",
        type: "image-with-text",
        enabled: false,
        settings: {
          eyebrow: "Brand story",
          title: "Build a visual story between your hero and collection.",
          body: "Use this section for launch messaging, campaign storytelling, or a spotlight block with a strong lifestyle image.",
          imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1800&auto=format&fit=crop",
          imagePosition: "right",
          backgroundColor: "#ffffff",
          textColor: "#111827",
          buttonLabel: "Learn more",
          buttonHref: "/about",
          paddingTop: 48,
          paddingBottom: 48,
        },
      },
      {
        id: "testimonials-main",
        type: "testimonials",
        enabled: false,
        settings: {
          eyebrow: "Testimonials",
          title: "Loved by repeat buyers",
          subtitle: "Social proof, review cards, and repeat-buyer confidence all in one section.",
          backgroundColor: "#f4f7fb",
          textColor: "#111827",
          paddingTop: 56,
          paddingBottom: 64,
        },
      },
    ],
  },
});

export const createSectionTemplate = (type: ThemeSectionType): ThemeSection => {
  const defaults = createDefaultThemeConfig().home.sections.find((section) => section.type === type);
  if (!defaults) {
    throw new Error(`Unknown section type: ${type}`);
  }
  return {
    ...defaults,
    id: `${type}-${Math.random().toString(36).slice(2, 8)}`,
    enabled: true,
    settings: { ...defaults.settings },
  };
};

export const normalizeThemeConfig = (config?: ThemeConfig | null): ThemeConfig => {
  if (!config?.home?.sections?.length) {
    return createDefaultThemeConfig();
  }
  return config;
};
