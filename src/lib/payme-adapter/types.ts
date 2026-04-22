export type CheckoutMode = "payment" | "subscription";

export interface BasketItem {
  productId: string;
  quantity: number;
  unitAmount?: number;
  name?: string;
  recurring?: {
    interval: "day" | "week" | "month" | "year";
  };
  metadata?: Record<string, string>;
}

export interface CheckoutLineItem {
  product_id: string;
  quantity: number;
  name: string;
  unit_amount: number;
  recurring?: {
    interval: "day" | "week" | "month" | "year";
  };
}

export interface CheckoutRequest {
  checkout_id?: string;
  source_app: string;
  mode: CheckoutMode;
  currency: string;
  line_items: CheckoutLineItem[];
  success_url: string;
  cancel_url: string;
  email?: string;
  account_id?: string;
  user_id?: string;
  coupon_code?: string;
  callback_url?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutResponse {
  checkout_id: string;
  redirect_url: string;
}

export interface CheckoutStatusResponse {
  checkout_id: string;
  status:
    | "created"
    | "open"
    | "coupon_applied"
    | "payment_pending"
    | "paid"
    | "subscription_active"
    | "failed"
    | "expired"
    | "canceled"
    | "unknown";
  payment_request_id?: string;
  payment_link_slug?: string;
}
