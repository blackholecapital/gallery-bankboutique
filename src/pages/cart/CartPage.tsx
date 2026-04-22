import { CartCheckoutBoundary } from '@/checkout-path/CartCheckoutBoundary';

export function CartPage() {
  return (
    <div className="flex min-h-[calc(100vh-120px)] w-full items-start justify-center px-4 pt-2 pb-24">
      <CartCheckoutBoundary />
    </div>
  );
}
