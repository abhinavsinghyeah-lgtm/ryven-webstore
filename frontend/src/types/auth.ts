export type UserRole = "customer" | "admin";

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  isVerified?: boolean;
  isPasswordSet?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface StoreSettings {
  id: number;
  storeName: string;
  logoUrl: string;
  logoWidthPx?: number;
  logoHeightPx?: number;
  heroImageUrl: string;
  authBackgroundUrl?: string | null;
  authBackgroundColor?: string | null;
  themeConfig?: import("./theme").ThemeConfig;
  tagline: string;
  updatedAt: string;
}
