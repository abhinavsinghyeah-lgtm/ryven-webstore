"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import {
  AdminCard,
  AdminShell,
  StatusBanner,
  adminButtonClasses,
  adminInputClasses,
  adminTextareaClasses,
} from "@/components/admin/AdminShell";
import { AdminLoader } from "@/components/admin/AdminLoader";
import type { AdminProductDetailResponse, Product, ProductCatalogResponse } from "@/types/product";

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
    new URL(form.imageUrl.trim());
  } catch {
    return "Image URL must be a valid URL.";
  }
  if (form.category.trim().length < 2) return "Category must be at least 2 characters.";
  return null;
}

function formatMoney(pricePaise: number) {
  return `INR ${(pricePaise / 100).toFixed(2)}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState(initialForm);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<AdminProductDetailResponse | null>(null);

  const loadProducts = async (query = "") => {
    const token = authStorage.getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<ProductCatalogResponse>(`/admin/products?page=1&limit=60&q=${encodeURIComponent(query)}`, { token });
      setProducts(result.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load products");
    } finally {
      setLoading(false);
    }
  };

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

    loadProducts();
  }, [router]);

  const openCreate = () => {
    setError(null);
    setFeedback(null);
    setEditingProductId(null);
    setForm(initialForm);
    setShowComposer(true);
  };

  const openEdit = (product: Product) => {
    setError(null);
    setFeedback(null);
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
    setShowComposer(true);
  };

  const closeComposer = () => {
    setShowComposer(false);
    setEditingProductId(null);
    setForm(initialForm);
  };

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
      name: form.name.trim(),
      slug,
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      pricePaise: Math.round(Number(form.priceRupees) * 100),
      currency: "INR",
      imageUrl: form.imageUrl.trim(),
      notes,
      category: form.category.trim(),
      isActive: true,
    };

    setError(null);
    setFeedback(null);
    setIsSaving(true);

    try {
      const isEditing = editingProductId !== null;
      const response = await apiRequest<{ product: Product }>(isEditing ? `/admin/products/${editingProductId}` : "/admin/products", {
        method: isEditing ? "PUT" : "POST",
        token,
        body: payload,
      });

      if (isEditing) {
        setProducts((prev) => prev.map((item) => (item.id === response.product.id ? { ...item, ...response.product } : item)));
        setFeedback("Product updated.");
      } else {
        setProducts((prev) => [{ ...response.product, orderCount: 0, unitsSold: 0, revenuePaise: 0 }, ...prev]);
        setFeedback("Product created.");
      }

      closeComposer();
    } catch (err) {
      setError(err instanceof Error ? err.message : editingProductId ? "Could not update product" : "Could not create product");
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async (product: Product) => {
    const token = authStorage.getToken();
    if (!token) return;
    if (!window.confirm(`Delete ${product.name}? It will be hidden from the storefront but preserved in order history.`)) return;

    setDeletingId(product.id);
    setError(null);
    setFeedback(null);
    try {
      await apiRequest<{ product: Product }>(`/admin/products/${product.id}`, {
        method: "DELETE",
        token,
      });
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      if (selectedProductId === product.id) {
        setSelectedProductId(null);
        setProductDetail(null);
      }
      setFeedback("Product deleted from the live catalog.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const openDetails = async (productId: number) => {
    const token = authStorage.getToken();
    if (!token) return;
    setSelectedProductId(productId);
    setProductDetail(null);
    setDetailLoading(true);
    setDetailError(null);
    try {
      const detail = await apiRequest<AdminProductDetailResponse>(`/admin/products/${productId}`, { token });
      setProductDetail(detail);
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : "Could not load product details");
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      `${product.name} ${product.category} ${product.slug} ${product.shortDescription}`.toLowerCase().includes(query),
    );
  }, [products, search]);

  return (
    <AdminShell
      title="Product Studio"
      subtitle="Manage the catalog like a proper storefront: spotlight products, inspect order history, and control what goes live."
      actions={
        <>
          <button type="button" className={adminButtonClasses.ghost} onClick={() => loadProducts(search)}>
            Refresh
          </button>
          <button type="button" className={adminButtonClasses.primary} onClick={openCreate}>
            Create product
          </button>
        </>
      }
    >
      {error ? <StatusBanner tone="error" title="Product issue" description={error} /> : null}
      {feedback ? <StatusBanner tone="success" title="Product updated" description={feedback} /> : null}

      <AdminCard>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Catalog control</p>
            <p className="mt-1 text-sm text-white/60">Search, review performance, and jump into a product’s order trail instantly.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, categories, or slugs"
              className={`${adminInputClasses} min-w-[280px]`}
            />
            <button type="button" className={adminButtonClasses.soft} onClick={() => loadProducts(search)}>
              Search live
            </button>
          </div>
        </div>
      </AdminCard>

      {loading ? (
        <AdminLoader label="Loading product catalog..." />
      ) : filteredProducts.length === 0 ? (
        <AdminCard>
          <p className="text-sm font-semibold text-white">No products found</p>
          <p className="mt-2 text-sm text-white/60">Start with a fresh product or try another search term.</p>
          <div className="mt-4">
            <button type="button" className={adminButtonClasses.primary} onClick={openCreate}>
              Create first product
            </button>
          </div>
        </AdminCard>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const reviewCount = 6 + (product.id % 5);
            const reviewScore = (4.6 + ((product.id % 4) * 0.1)).toFixed(1);
            return (
              <article
                key={product.id}
                className="group overflow-hidden rounded-[24px] border border-white/6 bg-[#151c26] shadow-[0_18px_38px_rgba(6,10,16,0.42)] transition hover:-translate-y-1 hover:border-white/12"
              >
                <button type="button" className="block w-full cursor-pointer text-left" onClick={() => openDetails(product.id)}>
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#0f1722]">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b111a] via-[#0b111a]/10 to-transparent" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
                        {product.category}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                          product.isActive
                            ? "border border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                            : "border border-rose-400/25 bg-rose-400/15 text-rose-200"
                        }`}
                      >
                        {product.isActive ? "Live" : "Hidden"}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Created</p>
                        <p className="mt-1 text-sm font-medium text-white">{formatDate(product.createdAt)}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-semibold text-white">
                        {formatMoney(product.pricePaise)}
                      </span>
                    </div>
                  </div>
                </button>

                <div className="space-y-4 p-5">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-white">{product.name}</h2>
                        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/35">/{product.slug}</p>
                      </div>
                      <button type="button" className={adminButtonClasses.soft} onClick={() => openEdit(product)}>
                        Edit
                      </button>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/65">{product.shortDescription}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <MetricPill label="Orders" value={String(product.orderCount ?? 0)} />
                    <MetricPill label="Units sold" value={String(product.unitsSold ?? 0)} />
                    <MetricPill label="Reviews" value={`${reviewScore} · ${reviewCount}`} />
                  </div>

                  <div className="grid gap-3 rounded-[20px] border border-white/6 bg-white/[0.03] p-4 md:grid-cols-2">
                    <InfoRow label="Revenue" value={formatMoney(product.revenuePaise ?? 0)} />
                    <InfoRow label="Last ordered" value={formatDate(product.lastOrderedAt)} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={adminButtonClasses.primary} onClick={() => openDetails(product.id)}>
                      View product
                    </button>
                    <Link href={`/products/${product.slug}`} target="_blank" className={adminButtonClasses.ghost}>
                      Open live page
                    </Link>
                    <button
                      type="button"
                      className={adminButtonClasses.ghost}
                      onClick={() => onDelete(product)}
                      disabled={deletingId === product.id}
                    >
                      {deletingId === product.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {showComposer ? (
        <Overlay onClose={closeComposer}>
          <div className="w-full max-w-3xl rounded-[28px] border border-white/10 bg-[#111821] p-6 shadow-[0_28px_80px_rgba(3,8,14,0.65)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/40">{editingProductId ? "Edit product" : "Create product"}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {editingProductId ? "Update this catalog item" : "Launch a new catalog item"}
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Keep this closed until you need it, then open the composer and make the update cleanly.
                </p>
              </div>
              <button type="button" className={adminButtonClasses.ghost} onClick={closeComposer}>
                Close
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
              <Input label="Name" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} required />
              <Input label="Category" value={form.category} onChange={(value) => setForm((prev) => ({ ...prev, category: value }))} required />
              <Input
                label="Short description"
                value={form.shortDescription}
                onChange={(value) => setForm((prev) => ({ ...prev, shortDescription: value }))}
                required
              />
              <Input
                label="Price (INR)"
                type="number"
                min={1}
                step="0.01"
                value={form.priceRupees}
                onChange={(value) => setForm((prev) => ({ ...prev, priceRupees: value }))}
                required
              />
              <div className="md:col-span-2">
                <Input
                  label="Image URL"
                  value={form.imageUrl}
                  onChange={(value) => setForm((prev) => ({ ...prev, imageUrl: value }))}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  label="Description"
                  value={form.description}
                  onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Notes (comma separated)"
                  value={form.notes}
                  onChange={(value) => setForm((prev) => ({ ...prev, notes: value }))}
                />
              </div>

              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button type="submit" disabled={isSaving} className={adminButtonClasses.primary}>
                  {isSaving ? "Saving..." : editingProductId ? "Update product" : "Create product"}
                </button>
                <button type="button" className={adminButtonClasses.ghost} onClick={closeComposer}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Overlay>
      ) : null}

      {selectedProductId ? (
        <Overlay onClose={() => setSelectedProductId(null)} align="right">
          <div className="ml-auto flex h-full w-full max-w-2xl flex-col overflow-hidden border-l border-white/10 bg-[#111821] shadow-[-24px_0_60px_rgba(3,8,14,0.55)]">
            <div className="flex items-start justify-between gap-4 border-b border-white/6 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/40">Product detail</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {productDetail?.product.name || "Loading product..."}
                </h2>
              </div>
              <button type="button" className={adminButtonClasses.ghost} onClick={() => setSelectedProductId(null)}>
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {detailLoading ? (
                <AdminLoader label="Loading product detail..." />
              ) : detailError ? (
                <StatusBanner tone="error" title="Detail error" description={detailError} />
              ) : productDetail ? (
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-[24px] border border-white/6 bg-[#151c26]">
                    <div className="relative aspect-[16/10] bg-[#0f1722]">
                      <Image src={productDetail.product.imageUrl} alt={productDetail.product.name} fill className="object-cover" sizes="50vw" />
                    </div>
                    <div className="space-y-4 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-white/40">{productDetail.product.category}</p>
                          <h3 className="mt-2 text-2xl font-semibold text-white">{productDetail.product.name}</h3>
                        </div>
                        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                          {productDetail.product.isActive ? "Live now" : "Hidden"}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-white/70">{productDetail.product.description}</p>
                      <div className="grid gap-3 md:grid-cols-2">
                        <InfoCard label="Revenue generated" value={formatMoney(productDetail.product.revenuePaise ?? 0)} />
                        <InfoCard label="Orders placed" value={String(productDetail.product.orderCount ?? 0)} />
                        <InfoCard label="Units sold" value={String(productDetail.product.unitsSold ?? 0)} />
                        <InfoCard label="Created at" value={formatDate(productDetail.product.createdAt)} />
                      </div>
                    </div>
                  </div>

                  <AdminCard className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">Review preview</p>
                        <p className="mt-1 text-sm text-white/55">Hardcoded for now so the layout is ready when reviews go live.</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/55">
                        Coming soon
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {productDetail.reviews.map((review) => (
                        <div key={review.id} className="rounded-[18px] border border-white/6 bg-white/[0.03] p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-white">{review.title}</p>
                            <span className="text-sm text-amber-300">{Array.from({ length: review.rating }, () => "★").join("")}</span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-white/65">{review.body}</p>
                          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-white/35">
                            {review.customerName} · {formatDate(review.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </AdminCard>

                  <AdminCard className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">Order trail</p>
                        <p className="mt-1 text-sm text-white/55">Exact timestamp, buyer, and order amount for every purchase of this product.</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/55">
                        {productDetail.product.orderHistory.length} entries
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {productDetail.product.orderHistory.length ? (
                        productDetail.product.orderHistory.map((entry) => (
                          <div key={`${entry.orderId}-${entry.userId}-${entry.orderedAt}`} className="rounded-[18px] border border-white/6 bg-white/[0.03] p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-white">Order #{entry.orderId}</p>
                                <p className="mt-1 text-sm text-white/60">
                                  Qty {entry.quantity} · {formatMoney(entry.lineTotalPaise)} · {entry.status}
                                </p>
                              </div>
                              <p className="text-xs uppercase tracking-[0.22em] text-white/35">{formatDate(entry.orderedAt)}</p>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
                              <span>Bought by</span>
                              <Link href={`/admin/users/${entry.userId}`} className="font-semibold text-emerald-300 hover:text-emerald-200">
                                {entry.fullName}
                              </Link>
                              <span className="text-white/35">·</span>
                              <span>{entry.email}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[18px] border border-white/6 bg-white/[0.03] p-4 text-sm text-white/55">
                          No orders for this product yet.
                        </div>
                      )}
                    </div>
                  </AdminCard>
                </div>
              ) : null}
            </div>
          </div>
        </Overlay>
      ) : null}
    </AdminShell>
  );
}

function Overlay({
  children,
  onClose,
  align = "center",
}: {
  children: ReactNode;
  onClose: () => void;
  align?: "center" | "right";
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`flex h-full w-full ${align === "right" ? "justify-end" : "items-center justify-center p-5"}`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/6 bg-white/[0.03] px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/6 bg-white/[0.03] p-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
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
        rows={5}
        className={adminTextareaClasses}
      />
    </label>
  );
}
