const supportedSectionTypes = ["hero", "featured-collection", "testimonials", "image-with-text"];

const createDefaultThemeConfig = () => ({
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

const clampNumber = (value, min, max, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
};

const defaultsByType = {
  hero: createDefaultThemeConfig().home.sections[0].settings,
  "featured-collection": createDefaultThemeConfig().home.sections[1].settings,
  "image-with-text": createDefaultThemeConfig().home.sections[2].settings,
  testimonials: createDefaultThemeConfig().home.sections[3].settings,
};

const normalizeSection = (section, index) => {
  if (!section || typeof section !== "object") return null;
  const type = supportedSectionTypes.includes(section.type) ? section.type : null;
  if (!type) return null;

  const defaults = defaultsByType[type];
  const settings = { ...defaults, ...(section.settings && typeof section.settings === "object" ? section.settings : {}) };

  if (type === "hero") {
    settings.minHeight = String(clampNumber(settings.minHeight, 50, 100, 100));
    settings.overlayOpacity = clampNumber(settings.overlayOpacity, 0, 85, 38);
  }

  if (type === "featured-collection") {
    settings.maxItems = clampNumber(settings.maxItems, 1, 12, 6);
    settings.columnsDesktop = clampNumber(settings.columnsDesktop, 2, 4, 3);
    settings.paddingTop = clampNumber(settings.paddingTop, 16, 160, 56);
    settings.paddingBottom = clampNumber(settings.paddingBottom, 16, 160, 64);
  }

  if (type === "image-with-text" || type === "testimonials") {
    settings.paddingTop = clampNumber(settings.paddingTop, 16, 160, defaults.paddingTop || 48);
    settings.paddingBottom = clampNumber(settings.paddingBottom, 16, 160, defaults.paddingBottom || 48);
  }

  return {
    id: typeof section.id === "string" && section.id.trim() ? section.id.trim() : `${type}-${index + 1}`,
    type,
    enabled: section.enabled !== false,
    settings,
  };
};

const normalizeThemeConfig = (rawConfig) => {
  const defaults = createDefaultThemeConfig();
  const incomingSections = rawConfig?.home?.sections;
  if (!Array.isArray(incomingSections)) {
    return defaults;
  }

  const sections = incomingSections
    .slice(0, 30)
    .map((section, index) => normalizeSection(section, index))
    .filter(Boolean);

  return {
    home: {
      sections: sections.length ? sections : defaults.home.sections,
    },
  };
};

module.exports = {
  supportedSectionTypes,
  createDefaultThemeConfig,
  normalizeThemeConfig,
};
