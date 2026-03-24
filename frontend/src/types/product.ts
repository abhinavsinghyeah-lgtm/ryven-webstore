export interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  pricePaise: number;
  currency: string;
  imageUrl: string;
  notes: string[];
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCatalogResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductDetailResponse {
  product: Product;
}
