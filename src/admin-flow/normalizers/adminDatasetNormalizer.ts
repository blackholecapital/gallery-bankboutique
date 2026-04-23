import { DEFAULT_ADMIN_DATASET, SCHEMA_VERSION } from '@/admin-flow/constants';
import type { AdminDataset, GalleryCard } from '@/admin-flow/types';

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeCard(card: GalleryCard): GalleryCard {
  const status = card.status ?? 'draft';
  return {
    ...card,
    tags: card.tags ?? [],
    badges: card.badges ?? [],
    promoCode: card.promoCode ?? null,
    promoDiscountPercent: card.promoDiscountPercent ?? null,
    active: status === 'active',
    pricing: {
      ...card.pricing,
      interval: card.pricing.interval ?? 'month',
      intervalLabel: card.pricing.intervalLabel ?? 'mo',
      currency: card.pricing.currency ?? DEFAULT_ADMIN_DATASET.siteConfig.defaultCurrency,
      price: card.pricing.price ?? card.pricing.setup,
      trial: card.pricing.trial ?? null,
      taxInclusive: card.pricing.taxInclusive ?? false,
    },
  };
}

export function normalizeAdminDataset(input: unknown): AdminDataset {
  const fallback = deepClone(DEFAULT_ADMIN_DATASET);
  if (!input || typeof input !== 'object') {
    return fallback;
  }

  const candidate = input as Partial<AdminDataset>;
  const merged: AdminDataset = {
    ...fallback,
    ...candidate,
    siteConfig: {
      ...fallback.siteConfig,
      ...(candidate.siteConfig ?? {}),
      theme: {
        ...fallback.siteConfig.theme,
        ...(candidate.siteConfig?.theme ?? {}),
      },
      fallbacks: {
        ...fallback.siteConfig.fallbacks,
        ...(candidate.siteConfig?.fallbacks ?? {}),
      },
    },
    cards: (candidate.cards ?? []).map(normalizeCard),
    commerceConfig: {
      ...fallback.commerceConfig,
      ...(candidate.commerceConfig ?? {}),
      usdc: {
        ...fallback.commerceConfig.usdc,
        ...(candidate.commerceConfig?.usdc ?? {}),
      },
    },
    meta: {
      ...fallback.meta,
      ...(candidate.meta ?? {}),
      schemaVersion: SCHEMA_VERSION,
    },
  };

  return merged;
}
