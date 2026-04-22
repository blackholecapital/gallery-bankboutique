import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/primitives/Button';

const STATUS_URL = 'https://api.xyz-labs.xyz/checkout/status';

function isFinal(status: string) {
  return status === 'paid' || status === 'subscription_active' || status === 'canceled' || status === 'failed' || status === 'expired';
}

export function CheckoutConfirmPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const checkoutId = params.get('checkout_id') || '';

  const [status, setStatus] = useState<string>('processing');
  const [error, setError] = useState<string | null>(null);

  const canPoll = useMemo(() => Boolean(checkoutId), [checkoutId]);

  useEffect(() => {
    if (!canPoll) return;

    let cancelled = false;
    let timer: any;

    async function poll() {
      try {
        const res = await fetch(`${STATUS_URL}?id=${encodeURIComponent(checkoutId)}`, {
          method: 'GET',
          headers: { accept: 'application/json' },
        });

        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error || 'Status lookup failed');
        }

        const next = data?.status || 'unknown';
        if (!cancelled) setStatus(next);

        if (!isFinal(next)) {
          timer = setTimeout(poll, 1200);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Status lookup failed');
      }
    }

    poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [canPoll, checkoutId]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px] rounded-[1.75rem] border border-white/50 bg-white/75 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.08),0_8px_28px_-6px_rgba(37,99,235,0.12)]">
        <p className="text-[16px] font-black text-blue-600 drop-shadow-[0_2px_4px_rgba(37,99,235,0.25)]">Payments</p>

        <div className="mt-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            ✓
          </div>

          <p className="mt-4 text-[18px] font-black text-slate-900">Payment Status</p>
          <p className="mt-1 text-[13px] text-slate-500">
            {checkoutId ? `Checkout ID: ${checkoutId}` : 'Missing checkout id'}
          </p>

          <p className="mt-4 text-[14px] font-semibold text-slate-800">
            {status === 'subscription_active' || status === 'paid' ? 'Confirmed' : status}
          </p>

          {error ? <p className="mt-3 text-[12px] font-semibold text-rose-600">{error}</p> : null}

          <Button className="mt-6 w-full min-h-12 rounded-2xl text-[14px] font-bold" onClick={() => navigate('/browse')}>
            Return to Gallery
          </Button>
        </div>
      </div>
    </div>
  );
}
