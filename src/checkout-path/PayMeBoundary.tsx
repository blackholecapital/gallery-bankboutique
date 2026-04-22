import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/primitives/Button';
import { useEstimate } from '@/estimate-save-path/EstimateProvider';
import { getProductById, slugifyProductName } from '@/product-intake-model/Product';
import { mapBasketToCheckoutRequest, initiateCheckout } from '@/lib/payme-adapter/index';
import { PAYME_WORKER_URL, PAYME_SOURCE_APP } from './paymeConfig';

export function PayMeBoundary() {
  const { productId } = useParams();
  const { items, checkoutProduct, setCheckoutProductId } = useEstimate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset stale checkout state on page load / browser refresh
  useEffect(() => {
    setLoading(false);
    setError(null);
  }, []);

  const routeProduct = useMemo(() => (productId ? getProductById(productId) : null), [productId]);

  useEffect(() => {
    if (routeProduct && productId) {
      setCheckoutProductId(productId);
    }
  }, [productId, routeProduct, setCheckoutProductId]);

  const activeProduct = routeProduct ?? checkoutProduct;

const basketItems = useMemo(() => {
  if (items.length > 0) {
    return items.map((item) => ({
      productId: slugifyProductName(item.product.name),
      quantity: 1,
      name: item.product.name,
      unitAmount: Math.round(item.product.price * 100),
    }));
  }

  if (activeProduct) {
    return [
      {
        productId: slugifyProductName(activeProduct.name),
        quantity: 1,
        name: activeProduct.name,
        unitAmount: Math.round(activeProduct.price * 100),
      },
    ];
  }

  return [];
}, [items, activeProduct]);

  async function handleCheckout() {
    try {
      setLoading(true);
      setError(null);
      
if (basketItems.some((item) => !item.unitAmount || item.unitAmount < 1)) {
  throw new Error("Missing product price for checkout");
}
      
      const payload = mapBasketToCheckoutRequest({
        sourceApp: PAYME_SOURCE_APP,
        mode: 'payment',
        currency: 'usd',
        successUrl: `${window.location.origin}${window.location.pathname}?checkout=success`,
        cancelUrl: `${window.location.origin}${window.location.pathname}?checkout=cancelled`,
        basketItems,
        metadata: activeProduct
          ? { productName: activeProduct.name }
          : undefined,
      });

      await initiateCheckout({
       handoffUrl: PAYME_WORKER_URL,
        payload,
        redirect: true,
      });
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Checkout launch failed');
    }
  }

  return (
    <div className="flex flex-1 flex-col rounded-[1.75rem] border border-white/50 bg-white/75 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.08),0_8px_28px_-6px_rgba(37,99,235,0.12)]">
      <p className="text-[16px] font-black text-blue-600 drop-shadow-[0_2px_4px_rgba(37,99,235,0.25)]">
        Powered by Payme
      </p>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
        {basketItems.length > 0 ? (
          <div className="space-y-3">
            {basketItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between rounded-xl border border-blue-100/40 bg-blue-50/30 px-4 py-3">
                <span className="text-[13px] font-semibold text-slate-700">{item.name ?? item.productId}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-semibold text-blue-600">${(item.unitAmount / 100).toFixed(2)}</span>
                  <span className="text-[11px] text-slate-400">x{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-12">
            <p className="text-[13px] text-slate-400">No items in checkout</p>
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>
      ) : null}

      <Button className="mt-5 w-full min-h-12 rounded-2xl text-[14px] font-bold" onClick={handleCheckout} disabled={loading || basketItems.length === 0}>
        {loading ? 'Redirecting…' : 'Buy'}
      </Button>
    </div>
  );
}
