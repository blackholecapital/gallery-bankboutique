import type { AdminDataset } from '@/admin-flow/types';

export const ADMIN_DATASET_STORAGE_KEY = 'admin.gallery.dataset.v1';
export const SCHEMA_VERSION = 'gallery-schema-v1';

export const DEFAULT_ADMIN_DATASET: AdminDataset = {
  siteConfig: {
    siteId: 'bank-boutique',
    siteName: 'Bank Boutique Gallery',
    brandName: 'Bank Boutique',
    layoutMode: 'gallery',
    active: true,
    packageTier: 'studio',
    packageCardLimit: 9,
    defaultCurrency: 'USD',
    locale: 'en-US',
    timezone: 'America/New_York',
    theme: {
      mode: 'dark',
      primaryColor: '#0B5FFF',
      accentColor: '#F5A524',
      background: '#0A0A0A',
      foreground: '#F5F5F5',
      surface: '#141414',
      border: '#2A2A2A',
    },
    fallbacks: {
      useDesktopImagesOnMobile: true,
    },
  },
  cards: [],
  commerceConfig: {
    provider: 'payme',
    mode: 'test',
    currency: 'USD',
    checkoutCreateUrl: 'https://api.xyz-labs.xyz/payme/create-checkout',
    checkoutStatusUrl: 'https://api.xyz-labs.xyz/payme/checkout-status',
    sourceApp: 'gallery-bankboutique',
    paymentMethods: ['card', 'usdc'],
    usdc: {
      receiveAddress: '0x3a71f0695DACde00CcECc622556F711E2bD50A0',
      contract: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      decimals: 6,
      chainId: 8453,
    },
  },
  meta: {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: '2026-01-01T00:00:00.000Z',
    source: 'admin',
    environment: 'production',
  },
};
