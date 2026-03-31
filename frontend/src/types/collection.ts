import type { Product } from "./product";

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  featuredOnHome: boolean;
  homePosition: number;
  createdAt: string;
  updatedAt: string;
  productCount: number;
  productIds?: number[];
}

export interface CollectionCatalogResponse {
  collections: Collection[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminCollectionsResponse {
  collections: Collection[];
}

export interface CollectionDetailResponse {
  collection: Collection;
  products: Product[];
}

export interface AdminCollectionDetailResponse {
  collection: Collection;
  products: Product[];
}
