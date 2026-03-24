import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/product/ProductDetailView";
import { apiRequest } from "@/lib/api";
import type { ProductDetailResponse } from "@/types/product";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  try {
    const response = await apiRequest<ProductDetailResponse>(`/products/${slug}`);
    return response.product;
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
