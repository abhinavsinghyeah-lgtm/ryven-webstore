"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AdminLoader } from "@/components/admin/AdminLoader";
import { AdminCard, AdminShell, StatusBanner, adminButtonClasses, adminInputClasses, adminTextareaClasses } from "@/components/admin/AdminShell";
import { ThemePageRenderer } from "@/components/theme/ThemePageRenderer";
import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { createSectionTemplate, normalizeThemeConfig, sectionTypeLabels } from "@/lib/theme-editor";
import type { StoreSettings } from "@/types/auth";
import type { Product, ProductCatalogResponse } from "@/types/product";
import type { ThemeConfig, ThemeEditorResponse, ThemeSection, ThemeSectionType } from "@/types/theme";

type SectionField =
  | { key: string; label: string; type: "text" | "number" | "color"; min?: number; max?: number }
  | { key: string; label: string; type: "textarea" }
  | { key: string; label: string; type: "select"; options: Array<{ value: string; label: string }> };

const fieldMap: Record<ThemeSectionType, SectionField[]> = {
  hero: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "title", label: "Heading", type: "textarea" },
    { key: "subtitle", label: "Subheading", type: "textarea" },
    { key: "buttonLabel", label: "Button label", type: "text" },
    { key: "buttonHref", label: "Button link", type: "text" },
    { key: "imageUrl", label: "Override image URL", type: "text" },
    { key: "minHeight", label: "Height (vh)", type: "number", min: 50, max: 100 },
    { key: "overlayOpacity", label: "Overlay opacity", type: "number", min: 0, max: 85 },
    {
      key: "contentAlign",
      label: "Content align",
      type: "select",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
    },
    { key: "objectPosition", label: "Image position", type: "text" },
    { key: "textColor", label: "Text color", type: "color" },
  ],
  "featured-collection": [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "title", label: "Heading", type: "textarea" },
    { key: "subtitle", label: "Subheading", type: "textarea" },
    { key: "ctaLabel", label: "CTA label", type: "text" },
    { key: "ctaHref", label: "CTA link", type: "text" },
    { key: "backgroundColor", label: "Background color", type: "color" },
    { key: "textColor", label: "Text color", type: "color" },
    { key: "maxItems", label: "Items shown", type: "number", min: 1, max: 12 },
    { key: "columnsDesktop", label: "Desktop columns", type: "number", min: 2, max: 4 },
    { key: "paddingTop", label: "Top padding", type: "number", min: 16, max: 160 },
    { key: "paddingBottom", label: "Bottom padding", type: "number", min: 16, max: 160 },
  ],
  testimonials: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "title", label: "Heading", type: "textarea" },
    { key: "subtitle", label: "Subheading", type: "textarea" },
    { key: "backgroundColor", label: "Background color", type: "color" },
    { key: "textColor", label: "Text color", type: "color" },
    { key: "paddingTop", label: "Top padding", type: "number", min: 16, max: 160 },
    { key: "paddingBottom", label: "Bottom padding", type: "number", min: 16, max: 160 },
  ],
  "image-with-text": [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "title", label: "Heading", type: "textarea" },
    { key: "body", label: "Body copy", type: "textarea" },
    { key: "imageUrl", label: "Image URL", type: "text" },
    {
      key: "imagePosition",
      label: "Image side",
      type: "select",
      options: [
        { value: "right", label: "Right" },
        { value: "left", label: "Left" },
      ],
    },
    { key: "backgroundColor", label: "Background color", type: "color" },
    { key: "textColor", label: "Text color", type: "color" },
    { key: "buttonLabel", label: "Button label", type: "text" },
    { key: "buttonHref", label: "Button link", type: "text" },
    { key: "paddingTop", label: "Top padding", type: "number", min: 16, max: 160 },
    { key: "paddingBottom", label: "Bottom padding", type: "number", min: 16, max: 160 },
  ],
};

export default function AdminThemeEditorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(normalizeThemeConfig(null));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    if (!token || !user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "admin") {
      router.replace("/account");
      return;
    }

    Promise.all([
      apiRequest<ThemeEditorResponse>("/admin/theme-editor", { token }),
      apiRequest<{ settings: StoreSettings }>("/store-settings", { token }),
      apiRequest<ProductCatalogResponse>("/products?page=1&limit=12", { token }),
    ])
      .then(([themeResponse, settingsResponse, productResponse]) => {
        const normalized = normalizeThemeConfig(themeResponse.themeConfig);
        setThemeConfig(normalized);
        setStoreSettings(settingsResponse.settings);
        setProducts(productResponse.products);
        setSelectedId(normalized.home.sections[0]?.id || null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load theme editor"))
      .finally(() => setLoading(false));
  }, [router]);

  const selectedSection = useMemo(
    () => themeConfig.home.sections.find((section) => section.id === selectedId) || null,
    [selectedId, themeConfig],
  );

  const updateSection = (id: string, updater: (section: ThemeSection) => ThemeSection) => {
    setThemeConfig((current) => ({
      home: {
        sections: current.home.sections.map((section) => (section.id === id ? updater(section) : section)),
      },
    }));
  };

  const moveSection = (id: string, direction: -1 | 1) => {
    setThemeConfig((current) => {
      const sections = [...current.home.sections];
      const index = sections.findIndex((section) => section.id === id);
      if (index < 0) return current;
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= sections.length) return current;
      const [item] = sections.splice(index, 1);
      sections.splice(targetIndex, 0, item);
      return { home: { sections } };
    });
  };

  const addSection = (type: ThemeSectionType) => {
    const section = createSectionTemplate(type);
    setThemeConfig((current) => ({ home: { sections: [...current.home.sections, section] } }));
    setSelectedId(section.id);
  };

  const removeSection = (id: string) => {
    setThemeConfig((current) => {
      const sections = current.home.sections.filter((section) => section.id !== id);
      const nextSections = sections.length ? sections : normalizeThemeConfig(null).home.sections;
      return { home: { sections: nextSections } };
    });
    if (selectedId === id) {
      const remaining = themeConfig.home.sections.find((section) => section.id !== id);
      setSelectedId(remaining?.id || null);
    }
  };

  const saveTheme = async () => {
    const token = authStorage.getToken();
    if (!token) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await apiRequest<ThemeEditorResponse>("/admin/theme-editor", {
        method: "PUT",
        token,
        body: { themeConfig },
      });
      setThemeConfig(normalizeThemeConfig(response.themeConfig));
      setSuccess("Theme editor updated. Homepage sections are now driven by this schema.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save theme editor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Theme Editor"
      subtitle="Shopify-style v1 editor: add, reorder, hide, and configure homepage sections from one control room."
      actions={
        <>
          <Link href="/" target="_blank" className={adminButtonClasses.ghost}>
            Open storefront
          </Link>
          <button type="button" className={adminButtonClasses.primary} onClick={saveTheme} disabled={saving}>
            {saving ? "Saving..." : "Save theme"}
          </button>
        </>
      }
    >
      {error ? <StatusBanner tone="error" title="Theme editor issue" description={error} /> : null}
      {success ? <StatusBanner tone="success" title="Theme updated" description={success} /> : null}

      {loading ? (
        <AdminLoader label="Loading theme editor..." />
      ) : (
        <section className="grid gap-6 xl:grid-cols-[280px_360px_minmax(0,1fr)]">
          <AdminCard className="p-4">
            <p className="text-sm font-semibold text-white">Homepage sections</p>
            <p className="mt-1 text-sm text-white/55">Select, reorder, or toggle sections just like a lightweight Shopify editor.</p>
            <div className="mt-4 space-y-3">
              {themeConfig.home.sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`rounded-[18px] border p-4 ${selectedId === section.id ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/6 bg-white/[0.03]"}`}
                >
                  <button type="button" className="w-full cursor-pointer text-left" onClick={() => setSelectedId(section.id)}>
                    <p className="text-sm font-semibold text-white">{sectionTypeLabels[section.type]}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/40">{section.enabled ? "Visible" : "Hidden"}</p>
                  </button>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" className={adminButtonClasses.soft} onClick={() => moveSection(section.id, -1)} disabled={index === 0}>
                      Up
                    </button>
                    <button
                      type="button"
                      className={adminButtonClasses.soft}
                      onClick={() => moveSection(section.id, 1)}
                      disabled={index === themeConfig.home.sections.length - 1}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      className={adminButtonClasses.ghost}
                      onClick={() => updateSection(section.id, (current) => ({ ...current, enabled: !current.enabled }))}
                    >
                      {section.enabled ? "Hide" : "Show"}
                    </button>
                    <button type="button" className={adminButtonClasses.ghost} onClick={() => removeSection(section.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-white/6 pt-5">
              <p className="text-sm font-semibold text-white">Add section</p>
              <div className="mt-3 grid gap-2">
                {(Object.keys(sectionTypeLabels) as ThemeSectionType[]).map((type) => (
                  <button key={type} type="button" className={adminButtonClasses.ghost} onClick={() => addSection(type)}>
                    + {sectionTypeLabels[type]}
                  </button>
                ))}
              </div>
            </div>
          </AdminCard>

          <AdminCard className="p-5">
            <p className="text-sm font-semibold text-white">Section settings</p>
            {selectedSection ? (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/40">{sectionTypeLabels[selectedSection.type]}</p>
                  <p className="mt-1 text-sm text-white/55">Edit content, spacing, colors, and a few layout controls for this section.</p>
                </div>

                {fieldMap[selectedSection.type].map((field) => (
                  <div key={field.key}>
                    <label className="block space-y-1.5">
                      <span className="text-sm text-white/70">{field.label}</span>
                      {field.type === "textarea" ? (
                        <textarea
                          value={String(selectedSection.settings[field.key] ?? "")}
                          onChange={(event) =>
                            updateSection(selectedSection.id, (current) => ({
                              ...current,
                              settings: { ...current.settings, [field.key]: event.target.value },
                            }))
                          }
                          rows={4}
                          className={adminTextareaClasses}
                        />
                      ) : field.type === "select" ? (
                        <select
                          value={String(selectedSection.settings[field.key] ?? field.options[0]?.value ?? "")}
                          onChange={(event) =>
                            updateSection(selectedSection.id, (current) => ({
                              ...current,
                              settings: { ...current.settings, [field.key]: event.target.value },
                            }))
                          }
                          className={adminInputClasses}
                        >
                          {field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          min={field.type === "number" ? field.min : undefined}
                          max={field.type === "number" ? field.max : undefined}
                          value={String(selectedSection.settings[field.key] ?? "")}
                          onChange={(event) =>
                            updateSection(selectedSection.id, (current) => ({
                              ...current,
                              settings: {
                                ...current.settings,
                                [field.key]: field.type === "number" ? Number(event.target.value || 0) : event.target.value,
                              },
                            }))
                          }
                          className={adminInputClasses}
                        />
                      )}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-white/55">Select a section from the left to begin editing.</p>
            )}
          </AdminCard>

          <div className="space-y-4">
            <AdminCard className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Live preview</p>
                  <p className="mt-1 text-sm text-white/55">Homepage preview powered by the same renderer the storefront uses.</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/55">
                  Home page
                </span>
              </div>
            </AdminCard>

            <div className="overflow-hidden rounded-[28px] border border-white/6 bg-white">
              <ThemePageRenderer settings={storeSettings} products={products} themeConfig={themeConfig} />
            </div>
          </div>
        </section>
      )}
    </AdminShell>
  );
}
