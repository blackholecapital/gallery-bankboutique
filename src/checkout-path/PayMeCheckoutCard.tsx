import { useMemo, useState } from 'react';
import { Button } from '@/components/primitives/Button';
import type { Product } from '@/product-intake-model/Product';
import { UsdcLogo } from './UsdcLogo';
import { UsdcInfoPopup } from './UsdcInfoPopup';
import { useBaseWallet } from './useBaseWallet';
import { getReceiveAddress, shortenAddress } from './receiveAddress';

export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'usdc';

function formatCurrency(amount: number) {
  return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export type CheckoutTotals = {
  setupSubtotal: number;
  monthlyRecurring: number;
  discount: number;
  totalDueToday: number;
  usdcDiscount?: number;
};

type Props = {
  products: Product[];
  totals: CheckoutTotals;
  method: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
  onApplyPromoCode: () => void;
  promoHint?: string;
  appliedPromoLabel?: string;
  onRemovePromo?: () => void;

  busy?: boolean;
  error?: string | null;

  usdcAddress?: string;
  onRemoveProduct?: (productId: string) => void;
  onPay: (method: PaymentMethod) => void;
};

export function PayMeCheckoutCard({
  products,
  totals,
  method,
  onMethodChange,
  promoCode,
  onPromoCodeChange,
  onApplyPromoCode,
  promoHint,
  appliedPromoLabel,
  onRemovePromo,
  busy,
  error,
  usdcAddress,
  onRemoveProduct,
  onPay,
}: Props) {
  const [infoOpen, setInfoOpen] = useState(false);
  const wallet = useBaseWallet();
  const receiveAddress = useMemo(() => usdcAddress?.trim() || getReceiveAddress(), [usdcAddress]);

  const [txPending, setTxPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const payLabel = useMemo(() => {
    const amount = formatCurrency(totals.totalDueToday);
    if (method === 'usdc') {
      if (wallet.status === 'wrong_network') return 'Connect to BASE network';
      if (wallet.status === 'connecting') return 'Opening wallet…';
      return `Pay ${amount} with USDC`;
    }
    if (method === 'apple_pay') return `Pay ${amount} with Apple Pay`;
    if (method === 'google_pay') return `Pay ${amount} with Google Pay`;
    return `Pay ${amount} securely`;
  }, [method, totals.totalDueToday, wallet.status]);

  const payButtonText = method === 'usdc' && txPending
    ? 'Confirm in wallet…'
    : busy
      ? 'Redirecting…'
      : payLabel;

  const payDisabled =
    busy ||
    (method === 'usdc' && (wallet.status === 'connecting' || txPending));

  async function handlePay() {
    if (method !== 'usdc') {
      onPay(method);
      return;
    }
    if (wallet.status === 'no_wallet' || wallet.status === 'disconnected') {
      await wallet.connect();
      return;
    }
    if (wallet.status === 'wrong_network') {
      await wallet.switchToBase();
      return;
    }
    if (wallet.status === 'ready') {
      setTxHash(null);
      setTxPending(true);
      try {
        const hash = await wallet.payUsdc({
          to: receiveAddress,
          amountUsd: totals.totalDueToday,
        });
        if (hash) {
          setTxHash(hash);
          onPay(method);
        }
      } finally {
        setTxPending(false);
      }
    }
  }

  return (
    <div className="w-full max-w-[420px] rounded-[24px] bg-white shadow-xl ring-1 ring-black/5">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="text-[18px] font-black tracking-tight text-blue-600 drop-shadow-[0_1px_2px_rgba(37,99,235,0.25)]">
            PayMe Checkout
          </div>
          <div className="text-blue-400">💧</div>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[14px] font-semibold text-slate-900">Review your order</div>
            <button
              type="button"
              className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={() => setInfoOpen(true)}
              aria-label="About USDC payments"
            >
              <UsdcLogo className="h-4 w-4" />
              <span>USDC</span>
              <span className="text-slate-400">?</span>
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {products.map((p) => (
              <div key={p.id} className="relative rounded-xl bg-white px-3 py-3 pr-8">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-[13px] font-semibold text-slate-900">{p.name}</span>
                    <span className="shrink-0 text-[11px] text-slate-400">• SKU {p.id}</span>
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Setup (one-time)</span>
                  <span className="text-[13px] font-semibold text-slate-900">{formatCurrency(p.setupPrice)}</span>
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <span className="text-[11px] text-blue-600">Hosting</span>
                  <span className="text-[12px] text-blue-600">{formatCurrency(p.monthlyPrice)}/mo</span>
                </div>

                {onRemoveProduct ? (
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-slate-300 hover:text-slate-500"
                    aria-label="Remove"
                    onClick={() => onRemoveProduct(p.id)}
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
          <div className="text-[14px] font-semibold text-slate-900">Summary</div>

          <div className="mt-3 space-y-2 text-[13px]">
            <div className="flex items-center justify-between text-slate-600">
              <span>Setup subtotal</span>
              <span>{formatCurrency(totals.setupSubtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="text-blue-600">Monthly recurring</span>
              <span className="text-blue-600">{formatCurrency(totals.monthlyRecurring)}/mo</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Discount</span>
              <span>- {formatCurrency(totals.discount)}</span>
            </div>

            {method === 'usdc' && (totals.usdcDiscount ?? 0) > 0 ? (
              <div className="flex items-center justify-between text-emerald-600">
                <span className="inline-flex items-center gap-1">
                  <UsdcLogo className="h-3.5 w-3.5" />
                  USDC bonus (10%)
                </span>
                <span>- {formatCurrency(totals.usdcDiscount ?? 0)}</span>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-[15px] font-semibold text-slate-900">Total due today</div>
            <div className="text-[20px] font-bold text-slate-900">{formatCurrency(totals.totalDueToday)}</div>
          </div>

          <div className="mt-1 text-right text-[11px] text-slate-400">
            Then {formatCurrency(totals.monthlyRecurring)}/month
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              value={promoCode}
              onChange={(e) => onPromoCodeChange(e.target.value)}
              placeholder="Enter code"
              className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-blue-400"
            />
            <Button
              variant="primary"
              className="h-10 rounded-xl px-4 text-[13px]"
              disabled={busy || promoCode.trim().length === 0}
              onClick={onApplyPromoCode}
            >
              Apply
            </Button>
          </div>

          {promoHint ? (
            <div className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
              {promoHint}
            </div>
          ) : null}

          {appliedPromoLabel ? (
            <div className="mt-2 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-[12px] text-emerald-800">
              <span>✓ {appliedPromoLabel}</span>
              {onRemovePromo ? (
                <button type="button" className="font-semibold hover:underline" onClick={onRemovePromo}>
                  Remove
                </button>
              ) : null}
            </div>
          ) : null}

          {error ? (
            <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-700">
              {error}
            </div>
          ) : null}

          {method === 'usdc' && wallet.error ? (
            <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-700">
              {wallet.error}
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              className={"h-10 rounded-xl border text-[13px] font-semibold " + (method === 'apple_pay' ? 'border-blue-500 text-blue-700' : 'border-slate-200 text-slate-700')}
              onClick={() => onMethodChange('apple_pay')}
            >
              Apple Pay
            </button>
            <button
              type="button"
              className={"h-10 rounded-xl border text-[13px] font-semibold " + (method === 'google_pay' ? 'border-blue-500 text-blue-700' : 'border-slate-200 text-slate-700')}
              onClick={() => onMethodChange('google_pay')}
            >
              Google Pay
            </button>
            <button
              type="button"
              className={"h-10 rounded-xl border text-[13px] font-semibold " + (method === 'card' ? 'border-blue-500 text-blue-700' : 'border-slate-200 text-slate-700')}
              onClick={() => onMethodChange('card')}
            >
              Card
            </button>
            <button
              type="button"
              className={"flex h-10 items-center justify-center gap-1.5 rounded-xl border text-[13px] font-semibold " + (method === 'usdc' ? 'border-blue-500 text-blue-700' : 'border-slate-200 text-slate-700')}
              onClick={() => onMethodChange('usdc')}
            >
              <UsdcLogo className="h-4 w-4" />
              <span>USDC</span>
            </button>
          </div>

          <Button
            variant="primary"
            className="mt-3 h-11 w-full rounded-xl text-[14px] font-semibold"
            disabled={payDisabled}
            onClick={handlePay}
          >
            {payButtonText}
          </Button>

          {method === 'usdc' && receiveAddress ? (
            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[12px] text-slate-700">
              <span className="font-semibold">Send USDC on BASE to:</span>
              <span className="font-mono text-[12px]" title={receiveAddress}>
                {shortenAddress(receiveAddress)}
              </span>
            </div>
          ) : null}

          {method === 'usdc' && txHash ? (
            <div className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700">
              ✓ Payment sent. Tx <span className="font-mono">{shortenAddress(txHash, 6, 4)}</span>
            </div>
          ) : null}

          <div className="mt-4 text-center text-[11px] text-slate-400">Powered by PayMe</div>
        </div>
      </div>

      <UsdcInfoPopup open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
}
