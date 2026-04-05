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
  AdminLoader,
  adminButtonClasses,
  adminInputClasses,
  adminTextareaClasses,
} from "@/components/admin/AdminShell";
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
  try { new URL(form.imageUrl.trim()); } catch { return "Image URL must be a valid URL."; }
  if (form.category.trim().length < 2) return "Category must be at least 2 characters.";
  return null;
}

function formatMoney(pricePaise: number) { return `INR ${(pricePaise / 100).toFixed(2)}`; }
function formatDate(value?: string | null) { if (!value) return "—"; return new Date(value).toLocaleString(); }

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [composerError, setComposerError] = useState<string | null>(null);
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
    setPageError(null);
    try {
      const result = await apiRequest<ProductCatalogResponse>(`/admin/products?page=1&limit=40&q=${encodeURIComponent(query)}`, { token });
      setProducts(result.products);
    } catch (err) {
      setPageError(err instanceof Error ? err.message : "Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    if (!token || !user) { router.replace("/login"); return; }
    if (user.role !== "admin") { router.replace("/account"); return; }
    loadProducts();
  }, [router]);

  const openCreate = () => { setPageError(null); setComposerError(null); setFeedback(null); setEditingProductId(null); setForm(initialForm); setShowComposer(true); };

  const openEdit = (product: Product) => {
    setPageError(null); setComposerError(null); setFeedback(null);
    setEditingProductId(product.id);
    setForm({
      name: product.name, shortDescription: product.shortDescription, description: product.description,
      priceRupees: String((product.pricePaise / 100).toFixed(2)), imageUrl: product.imageUrl,
      notes: product.notes.join(", "), category: product.category,
    });
    setShowComposer(true);
  };

  const closeComposer = () => { setShowComposer(false); setEditingProductId(null); setComposerError(null); setForm(initialForm); };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const token = authStorage.getToken();
    if (!token) return;
    const validationError = validateForm(form);
    if (validationError) { setComposerError(validationError); return; }

    const slug = form.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    const notes = form.notes.split(",").map((s) => s.trim()).filter((s) => s.length >= 2).slice(0, 8);
    const payload = {
      name: form.name.trim(), slug, shortDescription: form.shortDescription.trim(), description: form.description.trim(),
      pricePaise: Math.round(Number(form.priceRupees) * 100), currency: "INR", imageUrl: form.imageUrl.trim(),
      notes, category: form.category.trim(), isActive: true,
    };

    setPageError(null); setComposerError(null); setFeedback(null); setIsSaving(true);
    try {
      const isEditing = editingProductId !== null;
      const response = await apiRequest<{ product: Product }>(isEditing ? `/admin/products/${editingProductId}` : "/admin/products", {
        method: isEditing ? "PUT" : "POST", token, body: payload,
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
      setComposerError(err instanceof Error ? err.message : editingProductId ? "Could not update product" : "Could not create product");
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async (product: Product) => {
    const token = authStorage.getToken();
    if (!token) return;
    if (!window.confirm(`Delete ${product.name}? It will be hidden from the storefront but preserved in order history.`)) return;
    setDeletingId(product.id); setPageError(null); setFeedback(null);
    try {
      await apiRequest<{ product: Product }>(`/admin/products/${product.id}`, { method: "DELETE", token });
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      if (selectedProductId === product.id) { setSelectedProductId(null); setProductDetail(null); }
      setFeedback("Product deleted from the live catalog.");
    } catch (err) {
      setPageError(err instanceof Error ? err.message : "Could not delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const openDetails = async (productId: number) => {
    const token = authStorage.getToken();
    if (!token) return;
    setSelectedProductId(productId); setProductDetail(null); setDetailLoading(true); setDetailError(null);
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
    return products.filter((p) => `${p.name} ${p.category} ${p.slug} ${p.shortDescription}`.toLowerCase().includes(query));
  }, [products, search]);

  return (
    <AdminShell
      title="Product Studio"
      subtitle="Manage the catalog: spotlight products, inspect order history, and control what goes live."
      actions={
        <>
          <button type="button" className={adminButtonClasses.ghost} onClick={() => loadProducts(search.trim())}>Refresh</button>
          <button type="button" className={adminButtonClasses.primary} onClick={openCreate}>Create product</button>
        </>
      }
    >
      {pageError && <StatusBanner tone="error" title="Product issue" description={pageError} />}
      {feedback && <StatusBanner tone="success" title="Product updated" description={feedback} />}

      {/* Search toolbar */}
      <AdminCard>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <p className="adm-section-label">Catalog control</p>
            <p className="adm-section-sub">Search, review performance, and jump into a product's order trail.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, categories, or slugs" className={adminInputClasses} style={{ minWidth: 280 }} />
            <button type="button" className={adminButtonClasses.soft} onClick={() => loadProducts(search.trim())}>Search live</button>
          </div>
        </div>
      </AdminCard>

      {loading ? (
        <AdminLoader />
      ) : filteredProducts.length === 0 ? (
        <div className="adm-empty">
          <p>📦</p>
          <p>No products found</p>
          <p>Start with a fresh product or try another search term.</p>
          <div style={{ marginTop: 16 }}>
            <button type="button" className={adminButtonClasses.primary} onClick={openCreate}>Create first product</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))" }}>
          {filteredProducts.map((product) => (
            <article key={product.id} className="adm-card fade-up" style={{ padding: 0, overflow: "hidden" }}>
              <button type="button" style={{ display: "block", width: "100%", cursor: "pointer", textAlign: "left", border: "none", background: "none" }} onClick={() => openDetails(product.id)}>
                <div style={{ position: "relative", aspectRatio: "16/11", overflow: "hidden", background: "var(--bg-warm)" }}>
                  <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover", transition: "transform .3s" }} />
                  <div style={{ position: "absolute", left: 12, top: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span className="adm-badge adm-badge-gray">{product.category}</span>
                    <span className={`adm-badge ${product.isActive ? "adm-badge-green" : "adm-badge-red"}`}>
                      {product.isActive ? "Live" : "Hidden"}
                    </span>
                  </div>
                  <div style={{ position: "absolute", bottom: 12, right: 12 }}>
                    <span className="adm-badge adm-badge-pop">{formatMoney(product.pricePaise)}</span>
                  </div>
                </div>
              </button>

              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{product.name}</h2>
                    <p style={{ fontSize: 11, letterSpacing: ".2em", color: "var(--text-4)", marginTop: 2 }}>/{product.slug}</p>
                  </div>
                  <button type="button" className={adminButtonClasses.soft} onClick={() => openEdit(product)}>Edit</button>
                </div>

                <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {product.shortDescription}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                  <MetricPill label="Orders" value={String(product.orderCount ?? 0)} />
                  <MetricPill label="Units" value={String(product.unitsSold ?? 0)} />
                  <MetricPill label="Revenue" value={formatMoney(product.revenuePaise ?? 0)} />
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button type="button" className={adminButtonClasses.primary} onClick={() => openDetails(product.id)}>View</button>
                  <Link href={`/products/${product.slug}`} target="_blank" className={adminButtonClasses.ghost}>Live page</Link>
                  <button type="button" className={adminButtonClasses.danger} onClick={() => onDelete(product)} disabled={deletingId === product.id}>
                    {deletingId === product.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Composer modal */}
      {showComposer && (
        <div className="adm-modal-backdrop" onClick={closeComposer}>
          <div className="adm-modal" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div>
                <p className="adm-modal-title">{editingProductId ? "Update product" : "Create product"}</p>
                <p className="adm-modal-desc">{editingProductId ? "Edit this catalog item." : "Launch a new catalog item."}</p>
              </div>
              <button type="button" className={adminButtonClasses.ghost} onClick={closeComposer}>Close</button>
            </div>

            {composerError && <div style={{ marginTop: 14 }}><StatusBanner tone="error" title="Form issue" description={composerError} /></div>}

            <form onSubmit={onSubmit} style={{ marginTop: 20, display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
              <div className="adm-form-group"><label className="adm-form-label">Name</label><input className={adminInputClasses} required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
              <div className="adm-form-group"><label className="adm-form-label">Category</label><input className={adminInputClasses} required value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} /></div>
              <div className="adm-form-group"><label className="adm-form-label">Short description</label><input className={adminInputClasses} required value={form.shortDescription} onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))} /></div>
              <div className="adm-form-group"><label className="adm-form-label">Price (INR)</label><input className={adminInputClasses} type="number" min={1} step="0.01" required value={form.priceRupees} onChange={(e) => setForm((p) => ({ ...p, priceRupees: e.target.value }))} /></div>
              <div className="adm-form-group" style={{ gridColumn: "1/-1" }}><label className="adm-form-label">Image URL</label><input className={adminInputClasses} required value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} /></div>
              <div className="adm-form-group" style={{ gridColumn: "1/-1" }}><label className="adm-form-label">Description</label><textarea className={adminTextareaClasses} rows={4} required value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></div>
              <div className="adm-form-group" style={{ gridColumn: "1/-1" }}><label className="adm-form-label">Notes (comma separated)</label><input className={adminInputClasses} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} /></div>
              <div style={{ gridColumn: "1/-1", display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="submit" disabled={isSaving} className={adminButtonClasses.primary}>{isSaving ? "Saving..." : editingProductId ? "Update product" : "Create product"}</button>
                <button type="button" className={adminButtonClasses.ghost} onClick={closeComposer}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details slide-over */}
      {selectedProductId && (
        <div className="adm-modal-backdrop" onClick={() => setSelectedProductId(null)}>
          <div className="adm-modal" style={{ maxWidth: 640, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
              <div>
                <p className="adm-modal-title">{productDetail?.product.name || "Loading..."}</p>
                <p className="adm-modal-desc">Product detail</p>
              </div>
              <button type="button" className={adminButtonClasses.ghost} onClick={() => setSelectedProductId(null)}>Close</button>
            </div>

            {detailLoading ? <AdminLoader /> : detailError ? <StatusBanner tone="error" title="Detail error" description={detailError} /> : productDetail ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--border-light)" }}>
                  <div style={{ position: "relative", aspectRatio: "16/10", background: "var(--bg-warm)" }}>
                    <Image src={productDetail.product.imageUrl} alt={productDetail.product.name} fill style={{ objectFit: "cover" }} sizes="50vw" />
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div>
                        <span className="adm-badge adm-badge-gray" style={{ marginBottom: 8 }}>{productDetail.product.category}</span>
                        <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginTop: 4 }}>{productDetail.product.name}</h3>
                      </div>
                      <span className={`adm-badge ${productDetail.product.isActive ? "adm-badge-green" : "adm-badge-red"}`}>
                        {productDetail.product.isActive ? "Live now" : "Hidden"}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.7, marginTop: 12 }}>{productDetail.product.description}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                      <InfoCard label="Revenue" value={formatMoney(productDetail.product.revenuePaise ?? 0)} />
                      <InfoCard label="Orders" value={String(productDetail.product.orderCount ?? 0)} />
                      <InfoCard label="Units sold" value={String(productDetail.product.unitsSold ?? 0)} />
                      <InfoCard label="Created" value={formatDate(productDetail.product.createdAt)} />
                    </div>
                  </div>
                </div>

                {/* Reviews */}
                <AdminCard>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p className="adm-section-label">Review preview</p>
                    <span className="adm-badge adm-badge-gray">Coming soon</span>
                  </div>
                  <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                    {productDetail.reviews.map((review) => (
                      <div key={review.id} style={{ padding: 16, border: "1px solid var(--border-light)", borderRadius: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{review.title}</p>
                          <span style={{ color: "#d97706" }}>{"★".repeat(review.rating)}</span>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 6, lineHeight: 1.6 }}>{review.body}</p>
                        <p style={{ fontSize: 11, color: "var(--text-4)", marginTop: 8, letterSpacing: ".12em" }}>{review.customerName} · {formatDate(review.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </AdminCard>

                {/* Order trail */}
                <AdminCard>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p className="adm-section-label">Order trail</p>
                    <span className="adm-badge adm-badge-gray">{productDetail.product.orderHistory.length} entries</span>
                  </div>
                  <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                    {productDetail.product.orderHistory.length ? productDetail.product.orderHistory.map((entry) => (
                      <div key={`${entry.orderId}-${entry.userId}-${entry.orderedAt}`} style={{ padding: 16, border: "1px solid var(--border-light)", borderRadius: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Order #{entry.orderId}</p>
                            <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>Qty {entry.quantity} · {formatMoney(entry.lineTotalPaise)} · {entry.status}</p>
                          </div>
                          <p style={{ fontSize: 11, color: "var(--text-4)", letterSpacing: ".12em" }}>{formatDate(entry.orderedAt)}</p>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 8 }}>
                          Bought by <Link href={`/admin/users/${entry.userId}`} style={{ fontWeight: 600, color: "var(--pop)" }}>{entry.fullName}</Link> · {entry.email}
                        </p>
                      </div>
                    )) : (
                      <p style={{ fontSize: 13, color: "var(--text-3)", padding: 16, border: "1px solid var(--border-light)", borderRadius: 12 }}>No orders for this product yet.</p>
                    )}
                  </div>
                </AdminCard>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: "10px 14px", border: "1px solid var(--border-light)", borderRadius: 10, background: "var(--bg)" }}>
      <p style={{ fontSize: 10, letterSpacing: ".18em", color: "var(--text-4)", textTransform: "uppercase" }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginTop: 4 }}>{value}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 14, border: "1px solid var(--border-light)", borderRadius: 10 }}>
      <p style={{ fontSize: 10, letterSpacing: ".18em", color: "var(--text-4)", textTransform: "uppercase" }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{value}</p>
    </div>
  );
}
