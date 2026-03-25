"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
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
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">Product Management</h1>
        </div>
        <Link href="/admin" className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800">
          Back to dashboard
        </Link>
      </header>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <form onSubmit={onSubmit} className="rounded-2xl border border-neutral-300 bg-white/90 p-5 space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">{editingProductId ? "Edit Product" : "Add Product"}</h2>
          <Input label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
          <Input label="Short Description" value={form.shortDescription} onChange={(v) => setForm((f) => ({ ...f, shortDescription: v }))} required />
          <Textarea label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} required />
          <Input label="Price (INR)" type="number" value={form.priceRupees} onChange={(v) => setForm((f) => ({ ...f, priceRupees: v }))} required min={1} step="0.01" />
          <Input label="Image URL" value={form.imageUrl} onChange={(v) => setForm((f) => ({ ...f, imageUrl: v }))} required />
          <Input label="Notes (comma separated, optional)" value={form.notes} onChange={(v) => setForm((f) => ({ ...f, notes: v }))} />
          <Input label="Category" value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} required />

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="h-11 rounded-xl bg-neutral-900 px-5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSaving ? "Saving..." : editingProductId ? "Update Product" : "Create Product"}
            </button>

            {editingProductId ? (
              <button
                type="button"
                onClick={onCancelEdit}
                className="h-11 rounded-xl border border-neutral-300 px-5 text-sm font-semibold text-neutral-800"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <section className="rounded-2xl border border-neutral-300 bg-white/90 p-5">
          <h2 className="text-lg font-semibold text-neutral-900">Live Products</h2>
          {loading ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <ContentSkeleton key={index} rows={3} className="min-h-[120px]" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-600">No products yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {products.map((product) => (
                <li key={product.id} className="rounded-xl border border-neutral-200 p-3">
                  <p className="font-semibold text-neutral-900">{product.name}</p>
                  <p className="text-xs text-neutral-600 mt-1">/{product.slug} · {product.category}</p>
                  <p className="text-sm text-neutral-800 mt-2">INR {(product.pricePaise / 100).toFixed(2)}</p>
                  <button
                    type="button"
                    onClick={() => onStartEdit(product)}
                    className="mt-3 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
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
      <span className="text-sm text-neutral-700">{label}</span>
      <input
        type={type}
        required={required}
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-900"
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
      <span className="text-sm text-neutral-700">{label}</span>
      <textarea
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
      />
    </label>
  );
}
