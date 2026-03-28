export type UserRole = "customer" | "admin";

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
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
  heroImageUrl: string;
  authBackgroundUrl?: string | null;
  authBackgroundColor?: string | null;
  tagline: string;
  updatedAt: string;
}
