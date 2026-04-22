import { Button } from '@/components/primitives/Button';
import { UsdcLogo } from './UsdcLogo';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function UsdcInfoPopup({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[320px] rounded-2xl border border-white/60 bg-white p-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <UsdcLogo className="h-5 w-5" />
            <p className="text-[15px] font-black text-slate-900">USDC payments</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 transition hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="space-y-2 text-[13px] leading-snug text-slate-700">
          <li className="flex gap-2">
            <span aria-hidden="true">🟦</span>
            <span>
              <strong>USDC</strong> is the premier stablecoin — always worth <strong>$1 USD</strong>.
            </span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true">✅</span>
            <span>Easy to use once your wallet is connected.</span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true">•</span>
            <span>
              Select <strong>USDC</strong> as your payment method.
            </span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true">•</span>
            <span>
              Click <strong>Pay with USDC</strong> to connect your wallet.
            </span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true">•</span>
            <span>
              USDC on <strong>BASE network only</strong>. <span className="text-slate-400">(keeps it ez)</span>
            </span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true">•</span>
            <span>
              The pay button is <strong>locked if not on BASE</strong>. <span className="text-slate-400">(keeps it safe)</span>
            </span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true">😒</span>
            <span>
              Mobile users must use the <strong>browser inside your web3 wallet</strong>.
            </span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true">😉</span>
            <span>
              Mobile web3 wallets will <strong>not connect from outside browsers</strong>.
            </span>
          </li>
        </ul>

        <Button
          variant="primary"
          className="mt-4 w-full min-h-11 rounded-2xl text-[14px] font-bold"
          onClick={onClose}
        >
          Got it
        </Button>
      </div>
    </div>
  );
}
