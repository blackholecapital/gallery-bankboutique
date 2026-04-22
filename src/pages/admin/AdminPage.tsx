import { useMemo, useState } from 'react';
import { Button } from '@/components/primitives/Button';
import {
  DEFAULT_USDC_RECEIVE_ADDRESS,
  USDC_STORAGE_KEY,
  getReceiveAddress,
} from '@/checkout-path/receiveAddress';

export function AdminPage() {
  const requiredCode = (import.meta as any).env?.VITE_ADMIN_CODE as string | undefined;

  const [code, setCode] = useState('');
  const [address, setAddress] = useState(() => getReceiveAddress());
  const [saved, setSaved] = useState<string | null>(null);

  const accessGranted = useMemo(() => {
    if (!requiredCode) return true;
    return code.trim() === requiredCode.trim();
  }, [code, requiredCode]);

  const save = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(USDC_STORAGE_KEY, address.trim());
    setSaved('Saved.');
    setTimeout(() => setSaved(null), 1200);
  };

  const clear = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(USDC_STORAGE_KEY);
    setAddress(DEFAULT_USDC_RECEIVE_ADDRESS);
    setSaved('Reverted to default.');
    setTimeout(() => setSaved(null), 1200);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4">
      <div>
        <p className="text-[16px] font-black text-blue-600 drop-shadow-[0_2px_4px_rgba(37,99,235,0.25)]">Admin</p>
        <p className="mt-0.5 text-[12px] text-slate-500">Configure payout / USDC settings for this demo.</p>
      </div>

      {requiredCode ? (
        <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
          <p className="text-[12px] font-bold text-slate-700">Access</p>
          <p className="mt-1 text-[12px] text-slate-500">Enter admin code to edit settings.</p>
          <input
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Admin code"
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
        <p className="text-[12px] font-bold text-slate-700">USDC Address</p>
        <p className="mt-1 text-[12px] text-slate-500">
          Stored locally in this browser (demo). Use VITE_ADMIN_CODE to protect this page.
        </p>

        <input
          className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x…"
          disabled={!accessGranted}
        />

        <div className="mt-3 flex gap-2">
          <Button onClick={save} disabled={!accessGranted || !address.trim()}>
            Save
          </Button>
          <Button variant="secondary" onClick={clear} disabled={!accessGranted}>
            Clear
          </Button>
          {saved ? <span className="ml-2 text-[12px] font-semibold text-emerald-700">{saved}</span> : null}
        </div>
      </div>
    </div>
  );
}
