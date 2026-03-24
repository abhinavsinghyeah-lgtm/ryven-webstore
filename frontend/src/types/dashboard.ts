import type { AuthUser, StoreSettings } from "./auth";

export interface OrderListItem {
  id: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  totalPaise: number;
  currency: string;
  createdAt: string;
  itemCount: number;
  shippingName?: string;
  shippingCity?: string;
  shippingState?: string;
  customerEmail?: string;
}

export interface CustomerDashboardResponse {
  user: AuthUser;
  summary: {
    totalOrders: number;
    totalSpentPaise: number;
  };
  recentOrders: OrderListItem[];
}

export interface OrdersListResponse {
  orders: OrderListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminDashboardResponse {
  stats: {
    totalOrders: number;
    paidOrders: number;
    pendingOrders: number;
    totalRevenuePaise: number;
    paidRevenuePaise: number;
    totalProducts: number;
  };
}

export interface StoreSettingsResponse {
  settings: StoreSettings;
}
