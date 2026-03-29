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
  orderCount?: number;
  unitsSold?: number;
  revenuePaise?: number;
  lastOrderedAt?: string | null;
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

export interface AdminProductOrderHistoryItem {
  orderId: number;
  status: string;
  orderedAt: string;
  orderTotalPaise: number;
  currency: string;
  quantity: number;
  unitPricePaise: number;
  lineTotalPaise: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string | null;
}

export interface AdminProductReviewPlaceholder {
  id: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  customerName: string;
}

export interface AdminProductDetailResponse {
  product: Product & {
    orderHistory: AdminProductOrderHistoryItem[];
  };
  reviews: AdminProductReviewPlaceholder[];
}
