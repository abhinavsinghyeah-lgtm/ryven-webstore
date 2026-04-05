import type { Metadata } from "next";

import { CatalogContent } from "@/components/catalog/CatalogContent";
import { apiRequest } from "@/lib/api";
import type { ProductCatalogResponse } from "@/types/product";

export const metadata: Metadata = {
  title: "Catalog | RYVEN",
  description: "Browse the full RYVEN fragrance line-up. Modern scents crafted for everyday luxury.",
};

async function getProducts() {
  try {
    return await apiRequest<ProductCatalogResponse>("/products?limit=40");
  } catch {
    return null;
  }
}

export default async function ProductsPage() {
  const data = await getProducts();
  const products = data?.products ?? [];

  return <CatalogContent products={products} />;
}
