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

export interface EngagementSummary {
  liveVisitors: number;
  todayVisitors: number;
  weekVisitors: number;
  monthVisitors: number;
  avgSessionMinutes: number;
}

export interface TopPage {
  path: string;
  hits: number;
}

export interface EngagementOverviewResponse {
  summary: EngagementSummary;
  topPages: TopPage[];
}

export interface EngagementSession {
  sessionId: string;
  userId: number | null;
  fullName: string | null;
  email: string | null;
  ip: string | null;
  firstSeen: string;
  lastSeen: string;
  eventCount: number;
}

export interface EngagementLog {
  id: number;
  sessionId: string | null;
  userId: number | null;
  fullName: string | null;
  email: string | null;
  ip: string | null;
  path: string;
  method: string;
  status: number;
  durationMs: number;
  createdAt: string;
}

export interface EngagementSessionsResponse {
  sessions: EngagementSession[];
  pagination: { limit: number; offset: number; total: number };
}

export interface EngagementLogsResponse {
  logs: EngagementLog[];
  pagination: { limit: number; offset: number; total: number };
}

export interface AbandonedCartItem {
  userId: number;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  updatedAt: string;
  itemCount: number;
}

export interface AbandonedCartsResponse {
  carts: AbandonedCartItem[];
  pagination: { limit: number; offset: number; total: number };
}

export interface AdminControlStatusResponse {
  status: string;
  data: {
    apiUptimeSeconds: number;
    dbConnected: boolean;
    memory: { rss: number; heapTotal: number; heapUsed: number };
    env: string;
    controlActionsEnabled: boolean;
  };
}

export interface ControlErrorLog {
  id: number;
  path: string;
  method: string;
  status: number;
  ip: string | null;
  createdAt: string;
  email: string | null;
}

export interface ControlErrorLogsResponse {
  logs: ControlErrorLog[];
  pagination: { limit: number; offset: number; total: number };
}

export interface AdminUsersListItem {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: "admin" | "customer";
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  lastSeen: string | null;
  lastIp: string | null;
}

export interface AdminUsersResponse {
  users: AdminUsersListItem[];
  pagination: { limit: number; offset: number; total: number };
}

export interface NotificationEvent {
  type: "visit" | "signup" | "order" | "cart";
  refId: string;
  ip: string | null;
  email: string | null;
  name: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  events: NotificationEvent[];
  pagination: { limit: number; offset: number; total: number };
}

export interface AccountNotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  meta?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface AccountNotificationsResponse {
  notifications: AccountNotificationItem[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface StoreSettingsResponse {
  settings: StoreSettings;
}
