export type ThemeSectionType = "hero" | "featured-collection" | "testimonials" | "image-with-text";

export interface ThemeSection {
  id: string;
  type: ThemeSectionType;
  enabled: boolean;
  settings: Record<string, string | number | boolean | null | undefined>;
}

export interface ThemeConfig {
  home: {
    sections: ThemeSection[];
  };
}

export interface ThemeEditorResponse {
  themeConfig: ThemeConfig;
}
