export interface CartProductSnapshot {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  pricePaise: number;
  currency: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product: CartProductSnapshot;
  lineTotalPaise: number;
}

export interface CartData {
  items: CartItem[];
  subtotalPaise: number;
  totalItems: number;
  currency: string;
}

export interface GuestCartItem {
  productId: number;
  quantity: number;
  product: CartProductSnapshot;
}
