import { useCallback, useMemo, useState } from 'react';
import { useEstimate } from '@/estimate-save-path/EstimateProvider';
import type { Product } from '@/product-intake-model/Product';
import { GLOBAL_PROMOS } from '@/product-intake-model/Product';
import { PayMeCheckoutCard, type CheckoutTotals, type PaymentMethod } from './PayMeCheckoutCard';
import { getReceiveAddress } from './receiveAddress';

const CHECKOUT_API_BASE = 'https://api.xyz-labs.xyz';

type PromoResolution =
  | { ok: true; code: string; label: string; percentOff: number }
  | { ok: false; code: string; reason: string };

function normalize(code: string) {
  return code.trim().toUpperCase();
}

function resolvePromo(codeRaw: string, products: Product[]): PromoResolution | null {
  const code = normalize(codeRaw);
  if (!code) return null;

  if (code === GLOBAL_PROMOS.launchParty.code) {
    return { ok: true, code, label: `${GLOBAL_PROMOS.launchParty.label} (${code})`, percentOff: GLOBAL_PROMOS.launchParty.percentOff };
  }
  if (code === GLOBAL_PROMOS.usdc.code) {
    return { ok: true, code, label: GLOBAL_PROMOS.usdc.label, percentOff: GLOBAL_PROMOS.usdc.percentOff };
  }

  const promos = products
    .map((p) => (p.promoCode && p.promoDiscountPercent ? { code: p.promoCode, percent: p.promoDiscountPercent } : null))
    .filter(Boolean) as { code: string; percent: number }[];

  if (promos.length > 0 && promos.every((p) => normalize(p.code) === code)) {
    return { ok: true, code, label: `${code} — ${promos[0].percent}% OFF setup`, percentOff: promos[0].percent };
  }

  return { ok: false, code, reason: 'Invalid code' };
}

function computeTotals(
  products: Product[],
  promo: PromoResolution | null,
  method: PaymentMethod
): CheckoutTotals & { appliedLabel?: string } {
  const setupSubtotal = products.reduce((sum, p) => sum + (p.setupPrice || 0), 0);
  const monthlyRecurring = products.reduce((sum, p) => sum + (p.monthlyPrice || 0), 0);

  let promoDiscount = 0;
  let appliedLabel: string | undefined;
  if (promo?.ok) {
    promoDiscount = (setupSubtotal * promo.percentOff) / 100;
    appliedLabel = promo.label;
  }

  // First-month total includes setup + the first month's recurring minus any promo.
  const subtotalBeforeUsdc = setupSubtotal + monthlyRecurring - promoDiscount;

  // USDC stacking discount: 10% off the already-discounted total.
  const usdcDiscount =
    method === 'usdc' ? subtotalBeforeUsdc * (GLOBAL_PROMOS.usdc.percentOff / 100) : 0;

  const discount = promoDiscount + usdcDiscount;
  const totalDueToday = Math.max(0, setupSubtotal + monthlyRecurring - discount);

  return {
    setupSubtotal,
    monthlyRecurring,
    discount,
    totalDueToday,
    usdcDiscount,
    appliedLabel,
  };
}

export function CartCheckoutBoundary() {
  const { items, removeProduct } = useEstimate();
  const products = useMemo(() => items.map((i) => i.product), [items]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoResolution | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const usdcAddress = useMemo(() => getReceiveAddress(), []);

  const promoHint = useMemo(() => {
    if (!promoCode.trim()) return '🚀 Launch Party — 30% OFF (LAUNCH30) · 🪙 Extra 10% OFF with USDC (USDC)';
    return undefined;
  }, [promoCode]);

  const totals = useMemo(() => {
    return computeTotals(products, appliedPromo, method);
  }, [products, appliedPromo, method]);

  const applyPromo = useCallback(() => {
    setError(null);
    const resolved = resolvePromo(promoCode, products);
    if (!resolved) return;
    if (!resolved.ok) {
      setAppliedPromo(null);
      setError(resolved.reason);
      return;
    }
    setAppliedPromo(resolved);
  }, [promoCode, products]);

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
    setPromoCode('');
  }, []);

  const onPay = useCallback(
    async (payMethod: PaymentMethod) => {
      setError(null);

      if (payMethod === 'usdc') {
        // USDC transfer is executed in the card via the connected wallet.
        return;
      }

      setBusy(true);
      try {
        const checkoutId =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `chk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

        const origin = window.location.origin;
        const discount = totals.discount;
        const setupSubtotal = totals.setupSubtotal;
        const discountRatio = setupSubtotal > 0 ? Math.max(0, Math.min(1, (setupSubtotal - discount) / setupSubtotal)) : 1;

        const lineItems = products.flatMap((p) => {
          const setupCents = Math.round((p.setupPrice || 0) * 100 * discountRatio);
          const monthlyCents = Math.round((p.monthlyPrice || 0) * 100);

          const out: Record<string, unknown>[] = [];
          if (setupCents > 0) {
            out.push({
              product_id: `${p.id}_setup`,
              name: `${p.name} (Setup)`,
              quantity: 1,
              unit_amount: setupCents,
            });
          }
          if (monthlyCents > 0) {
            out.push({
              product_id: `${p.id}_monthly`,
              name: `${p.name} (Monthly)`,
              quantity: 1,
              unit_amount: monthlyCents,
              recurring: { interval: 'month' },
            });
          }
          return out;
        });

        const response = await fetch(`${CHECKOUT_API_BASE}/checkout/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkout_id: checkoutId,
            mode: 'subscription',
            currency: 'usd',
            success_url: `${origin}/checkout/confirm`,
            cancel_url: `${origin}/cart`,
            metadata: {
              source_origin: origin,
              source_app: 'gallery',
              promo_code: appliedPromo?.ok ? appliedPromo.code : '',
            },
            line_items: lineItems,
          }),
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          setError(data?.error ?? 'Checkout failed.');
          return;
        }

        if (data?.redirect_url) {
          window.location.href = data.redirect_url;
          return;
        }

        setError('Checkout failed. Missing redirect URL.');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Checkout failed.');
      } finally {
        setBusy(false);
      }
    },
    [products, totals.discount, totals.setupSubtotal, appliedPromo, usdcAddress],
  );

  if (products.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-[520px] flex-col items-center justify-center gap-3 rounded-3xl bg-white/70 p-8 text-slate-600 shadow-lg">
        <div className="text-sm font-semibold">Basket is empty</div>
        <div className="text-xs text-slate-500">Add something from Browse.</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <PayMeCheckoutCard
        products={products}
        totals={totals}
        method={method}
        onMethodChange={setMethod}
        promoCode={promoCode}
        onPromoCodeChange={setPromoCode}
        onApplyPromoCode={applyPromo}
        promoHint={promoHint}
        appliedPromoLabel={appliedPromo?.ok ? totals.appliedLabel : undefined}
        onRemovePromo={appliedPromo?.ok ? removePromo : undefined}
        busy={busy}
        error={error}
        usdcAddress={usdcAddress}
        onRemoveProduct={(id) => {
          const match = products.find((p) => p.id === id);
          if (match) removeProduct(match.name);
        }}
        onPay={onPay}
      />
    </div>
  );
}
