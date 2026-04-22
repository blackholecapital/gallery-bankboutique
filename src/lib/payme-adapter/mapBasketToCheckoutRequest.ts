import { createCheckoutId, assertNonEmpty } from "./utils";
import type { BasketItem, CheckoutRequest, CheckoutMode } from "./types";

export interface MapBasketOptions {
  sourceApp: string;
  mode: CheckoutMode;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  basketItems: BasketItem[];
  email?: string;
  accountId?: string;
  userId?: string;
  couponCode?: string;
  callbackUrl?: string;
  metadata?: Record<string, string>;
  checkoutId?: string;
}

export function mapBasketToCheckoutRequest(
  options: MapBasketOptions,
): CheckoutRequest {
  assertNonEmpty(options.sourceApp, "sourceApp");
  assertNonEmpty(options.currency, "currency");
  assertNonEmpty(options.successUrl, "successUrl");
  assertNonEmpty(options.cancelUrl, "cancelUrl");

  if (!options.basketItems?.length) {
    throw new Error("basketItems must contain at least one item");
  }

  const line_items = options.basketItems.map((item) => {
    assertNonEmpty(item.productId, "basket item productId");
    assertNonEmpty(item.name || "", `basket item name for ${item.productId}`);

    if (!Number.isFinite(item.quantity) || item.quantity < 1) {
      throw new Error(`invalid quantity for product ${item.productId}`);
    }

    if (!Number.isFinite(item.unitAmount) || (item.unitAmount ?? 0) < 1) {
      throw new Error(`missing or invalid unitAmount for product ${item.productId}`);
    }

    return {
      product_id: item.productId,
      quantity: item.quantity,
      name: item.name!,
      unit_amount: Math.round(item.unitAmount!),
      recurring: item.recurring,
    };
  });

  return {
    checkout_id: options.checkoutId ?? createCheckoutId(),
    source_app: options.sourceApp,
    mode: options.mode,
    currency: options.currency.toLowerCase(),
    line_items,
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    email: options.email,
    account_id: options.accountId,
    user_id: options.userId,
    coupon_code: options.couponCode,
    callback_url: options.callbackUrl,
    metadata: options.metadata,
  };
}
