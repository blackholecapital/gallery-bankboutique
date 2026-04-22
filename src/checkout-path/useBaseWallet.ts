import { useCallback, useEffect, useState } from 'react';
import { USDC_BASE_CONTRACT, USDC_DECIMALS } from './receiveAddress';

export const BASE_CHAIN_ID_HEX = '0x2105';

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export type WalletStatus =
  | 'no_wallet'
  | 'disconnected'
  | 'connecting'
  | 'wrong_network'
  | 'ready';

export type PayUsdcArgs = {
  to: string;
  amountUsd: number;
};

export type BaseWalletState = {
  status: WalletStatus;
  address: string | null;
  chainId: string | null;
  error: string | null;
  connect: () => Promise<void>;
  switchToBase: () => Promise<void>;
  payUsdc: (args: PayUsdcArgs) => Promise<string | null>;
};

function toUsdcUnits(amountUsd: number): bigint {
  // USDC uses 6 decimals. Round to avoid floating-point drift.
  const units = Math.round(amountUsd * 10 ** USDC_DECIMALS);
  return BigInt(units);
}

function padHex(value: string, bytes: number): string {
  const clean = value.replace(/^0x/, '').toLowerCase();
  return clean.padStart(bytes * 2, '0');
}

function encodeTransfer(to: string, amount: bigint): string {
  // transfer(address,uint256) selector + 32-byte to + 32-byte amount.
  const selector = 'a9059cbb';
  const addr = padHex(to, 32);
  const amt = padHex(amount.toString(16), 32);
  return `0x${selector}${addr}${amt}`;
}

export function useBaseWallet(): BaseWalletState {
  const hasProvider = typeof window !== 'undefined' && Boolean(window.ethereum);
  const [status, setStatus] = useState<WalletStatus>(hasProvider ? 'disconnected' : 'no_wallet');
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const evaluateNetwork = useCallback((cid: string | null, addr: string | null) => {
    if (!addr) {
      setStatus('disconnected');
      return;
    }
    if (cid === BASE_CHAIN_ID_HEX) {
      setStatus('ready');
    } else {
      setStatus('wrong_network');
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    let cancelled = false;
    (async () => {
      try {
        const accts = (await window.ethereum!.request({ method: 'eth_accounts' })) as string[];
        const cid = (await window.ethereum!.request({ method: 'eth_chainId' })) as string;
        if (cancelled) return;
        const next = accts[0] ?? null;
        setAddress(next);
        setChainId(cid ?? null);
        evaluateNetwork(cid ?? null, next);
      } catch {
        // Silent — treat as disconnected.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [evaluateNetwork]);

  useEffect(() => {
    if (!window.ethereum?.on) return;
    const onAccounts = (...args: unknown[]) => {
      const accts = (args[0] as string[]) ?? [];
      const next = accts[0] ?? null;
      setAddress(next);
      evaluateNetwork(chainId, next);
    };
    const onChain = (...args: unknown[]) => {
      const cid = (args[0] as string) ?? null;
      setChainId(cid);
      evaluateNetwork(cid, address);
    };
    window.ethereum.on('accountsChanged', onAccounts);
    window.ethereum.on('chainChanged', onChain);
    return () => {
      window.ethereum?.removeListener?.('accountsChanged', onAccounts);
      window.ethereum?.removeListener?.('chainChanged', onChain);
    };
  }, [address, chainId, evaluateNetwork]);

  const connect = useCallback(async () => {
    setError(null);
    if (!window.ethereum) {
      setStatus('no_wallet');
      setError('No Web3 wallet detected. On mobile, open this page inside your wallet app.');
      return;
    }
    try {
      setStatus('connecting');
      const accts = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[];
      const cid = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
      const next = accts[0] ?? null;
      setAddress(next);
      setChainId(cid ?? null);
      evaluateNetwork(cid ?? null, next);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Wallet connection rejected.';
      setError(message);
      setStatus(address ? 'wrong_network' : 'disconnected');
    }
  }, [address, evaluateNetwork]);

  const switchToBase = useCallback(async () => {
    setError(null);
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID_HEX }]
      });
    } catch (e) {
      const err = e as { code?: number; message?: string };
      if (err?.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: BASE_CHAIN_ID_HEX,
              chainName: 'Base',
              nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org']
            }]
          });
        } catch (addErr) {
          setError(addErr instanceof Error ? addErr.message : 'Failed to add BASE network.');
        }
      } else {
        setError(err?.message ?? 'Failed to switch network.');
      }
    }
  }, []);

  const payUsdc = useCallback(
    async ({ to, amountUsd }: PayUsdcArgs) => {
      setError(null);
      if (!window.ethereum) {
        setError('No Web3 wallet detected.');
        return null;
      }
      if (!address) {
        setError('Wallet not connected.');
        return null;
      }
      if (chainId !== BASE_CHAIN_ID_HEX) {
        setError('Switch to BASE network before paying.');
        return null;
      }
      if (!to || !to.startsWith('0x')) {
        setError('Invalid receive address.');
        return null;
      }
      try {
        const amount = toUsdcUnits(amountUsd);
        const data = encodeTransfer(to, amount);
        const txHash = (await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: address,
            to: USDC_BASE_CONTRACT,
            data,
            value: '0x0',
          }]
        })) as string;
        return txHash;
      } catch (e) {
        const err = e as { code?: number; message?: string };
        // 4001 = user rejected
        if (err?.code !== 4001) {
          setError(err?.message ?? 'Transaction failed.');
        }
        return null;
      }
    },
    [address, chainId]
  );

  return { status, address, chainId, error, connect, switchToBase, payUsdc };
}
