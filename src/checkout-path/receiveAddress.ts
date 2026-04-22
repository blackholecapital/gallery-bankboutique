/**
 * Canonical USDC receive address for the Gallery payout wallet.
 *
 * This is the live monetization engine — the default locked in here is
 * read on every checkout. The /admin page may override it in localStorage
 * for per-browser testing, but this constant is the source of truth.
 *
 * Derived from the wallet with last-5 "D50A0" shown in the UI screenshot.
 * Update this string if the receive wallet ever rotates.
 */
export const DEFAULT_USDC_RECEIVE_ADDRESS =
  '0x3a71f0695DACde00CcECc622556F711E2bD50A0';

export const USDC_STORAGE_KEY = 'payme_usdc_address';

/**
 * Native USDC on BASE mainnet (Circle-issued, chainId 8453).
 * https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
 */
export const USDC_BASE_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const USDC_DECIMALS = 6;

export function getReceiveAddress(): string {
  if (typeof window !== 'undefined') {
    const override = window.localStorage.getItem(USDC_STORAGE_KEY);
    if (override && override.trim()) return override.trim();
  }
  return DEFAULT_USDC_RECEIVE_ADDRESS;
}

export function shortenAddress(addr: string, head = 6, tail = 5): string {
  if (!addr) return '';
  if (addr.length <= head + tail + 3) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}
