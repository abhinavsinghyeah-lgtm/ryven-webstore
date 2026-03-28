"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { AdminCard, AdminShell, StatusBanner, adminButtonClasses, adminInputClasses, adminTextareaClasses } from "@/components/admin/AdminShell";
import { ContentSkeleton } from "@/components/ui/ContentSkeleton";
import type { Product, ProductCatalogResponse } from "@/types/product";

const initialForm = {
  name: "",
  shortDescription: "",
  description: "",
  priceRupees: "",
  imageUrl: "",
  notes: "",
  category: "",
};

function validateForm(form: typeof initialForm): string | null {
  if (form.name.trim().length < 2) return "Name must be at least 2 characters.";
  if (form.shortDescription.trim().length < 8) return "Short description must be at least 8 characters.";
  if (form.description.trim().length < 20) return "Description must be at least 20 characters.";
  if (!Number.isFinite(Number(form.priceRupees)) || Number(form.priceRupees) <= 0) return "Price must be greater than 0.";
  try {
    // URL constructor throws when input is not a valid absolute URL.
    new URL(form.imageUrl.trim());
  } catch {
    return "Image URL must be a valid URL.";
  }
  if (form.category.trim().length < 2) return "Category must be at least 2 characters.";
  return null;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

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

    setError(null);
    apiRequest<ProductCatalogResponse>("/products?page=1&limit=40", { token })
      .then((res) => setProducts(res.products))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load products"))
      .finally(() => setLoading(false));
  }, [router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const token = authStorage.getToken();
    if (!token) return;

    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const notes = form.notes
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length >= 2)
      .slice(0, 8);

    const payload = {
      name: form.name,
      slug,
      shortDescription: form.shortDescription,
      description: form.description,
      pricePaise: Math.round(Number(form.priceRupees) * 100),
      currency: "INR",
      imageUrl: form.imageUrl.trim(),
      notes,
      category: form.category.trim(),
      isActive: true,
    };

    setError(null);
    setIsSaving(true);

    try {
      const isEditing = editingProductId !== null;
      const response = await apiRequest<{ product: Product }>(isEditing ? `/admin/products/${editingProductId}` : "/admin/products", {
        method: isEditing ? "PUT" : "POST",
        token,
        body: payload,
      });

      if (isEditing) {
        setProducts((prev) => prev.map((item) => (item.id === response.product.id ? response.product : item)));
      } else {
        setProducts((prev) => [response.product, ...prev]);
      }

      setForm(initialForm);
      setEditingProductId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : editingProductId ? "Could not update product" : "Could not create product");
    } finally {
      setIsSaving(false);
    }
  };

  const onStartEdit = (product: Product) => {
    setError(null);
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      priceRupees: String((product.pricePaise / 100).toFixed(2)),
      imageUrl: product.imageUrl,
      notes: product.notes.join(", "),
      category: product.category,
    });
  };

  const onCancelEdit = () => {
    setEditingProductId(null);
    setForm(initialForm);
    setError(null);
  };

  return (
    <AdminShell
      title="Product Studio"
      subtitle="Build, edit, and spotlight catalog items without leaving the dashboard."
      actions={
        <Link href="/admin" className={adminButtonClasses.ghost}>
          Back to dashboard
        </Link>
      }
    >
      {error ? <StatusBanner tone="error" title="Product update error" description={error} /> : null}

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <AdminCard>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{editingProductId ? "Edit Product" : "Add Product"}</h2>
            {editingProductId ? <span className="text-xs uppercase tracking-[0.24em] text-white/50">Editing</span> : null}
          </div>
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <Input label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
            <Input label="Short Description" value={form.shortDescription} onChange={(v) => setForm((f) => ({ ...f, shortDescription: v }))} required />
            <Textarea label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} required />
            <Input label="Price (INR)" type="number" value={form.priceRupees} onChange={(v) => setForm((f) => ({ ...f, priceRupees: v }))} required min={1} step="0.01" />
            <Input label="Image URL" value={form.imageUrl} onChange={(v) => setForm((f) => ({ ...f, imageUrl: v }))} required />
            <Input label="Notes (comma separated, optional)" value={form.notes} onChange={(v) => setForm((f) => ({ ...f, notes: v }))} />
            <Input label="Category" value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} required />

            <div className="flex flex-wrap gap-2 pt-2">
              <button type="submit" disabled={isSaving} className={adminButtonClasses.primary}>
                {isSaving ? "Saving..." : editingProductId ? "Update Product" : "Create Product"}
              </button>

              {editingProductId ? (
                <button type="button" onClick={onCancelEdit} className={adminButtonClasses.ghost}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-semibold text-white">Live Products</h2>
          {loading ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <ContentSkeleton key={index} rows={3} className="min-h-[120px]" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="mt-3 text-sm text-white/60">No products yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {products.map((product) => (
                <li key={product.id} className="rounded-2xl border border-white/5 bg-white/5 p-4 shadow-sm">
                  <p className="font-semibold text-white">{product.name}</p>
                  <p className="mt-1 text-xs text-white/50">/{product.slug} · {product.category}</p>
                  <p className="mt-2 text-sm text-white/80">INR {(product.pricePaise / 100).toFixed(2)}</p>
                  <button
                    type="button"
                    onClick={() => onStartEdit(product)}
                    className="mt-3 inline-flex items-center rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:bg-white/10"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </section>
    </AdminShell>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
  type = "text",
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  min?: number;
  step?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-white/70">{label}</span>
      <input
        type={type}
        required={required}
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={adminInputClasses}
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-white/70">{label}</span>
      <textarea
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className={adminTextareaClasses}
      />
    </label>
  );
}
