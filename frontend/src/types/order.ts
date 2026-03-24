export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string | null;
  unitPricePaise: number;
  currency: string;
  quantity: number;
  lineTotalPaise: number;
}

export interface Order {
  id: number;
  userId: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  shippingCountry: string;
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface InitiateCheckoutResponse {
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  userName: string;
  userEmail: string;
  checkoutToken: string;
}

export interface VerifyCheckoutResponse {
  order: Order;
  authToken: string;
  isNew: boolean;
}
