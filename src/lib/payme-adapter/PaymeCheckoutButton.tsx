import * as React from "react";
import type { CheckoutRequest } from "./types";
import { initiateCheckout } from "./initiateCheckout";

export interface PaymeCheckoutButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  handoffUrl: string;
  payload: CheckoutRequest;
  onBeforeCheckout?: () => void | Promise<void>;
  onCheckoutError?: (error: Error) => void;
  children?: React.ReactNode;
}

export function PaymeCheckoutButton({
  handoffUrl,
  payload,
  onBeforeCheckout,
  onCheckoutError,
  children,
  disabled,
  ...buttonProps
}: PaymeCheckoutButtonProps) {
  const [loading, setLoading] = React.useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      await onBeforeCheckout?.();
      await initiateCheckout({ handoffUrl, payload, redirect: true });
    } catch (error) {
      onCheckoutError?.(
        error instanceof Error ? error : new Error("checkout failed"),
      );
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      {...buttonProps}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? "Redirecting..." : (children ?? "Proceed to checkout")}
    </button>
  );
}
