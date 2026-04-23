export type ValidationSeverity = 'error' | 'warning';

export type ValidationIssue = {
  ruleId: string;
  path: string;
  message: string;
  severity: ValidationSeverity;
};

export type MediaRef = {
  role: string;
  url?: string;
  r2Key?: string;
  alt?: string;
  width?: number;
  height?: number;
  mime?: string;
};

export type MediaAsset = MediaRef & {
  id: string;
  orderIndex: number;
};

export type CardPricing = {
  setup: number;
  monthly: number;
  currency?: string;
  interval?: 'month' | 'year' | 'none';
  intervalLabel?: string;
  price?: number;
  trial?: { days: number } | null;
  taxInclusive?: boolean;
};

export type GalleryCard = {
  id: string;
  sku: string;
  title: string;
  tagline: string;
  description?: string;
  outcome: string;
  bullets: string[];
  mainImage: MediaRef;
  thumbnail?: MediaRef | null;
  media: MediaAsset[];
  cta: {
    kind: 'internal' | 'external';
    label?: string;
    internalPath?: string;
    externalUrl?: string;
  };
  pricing: CardPricing;
  tags?: string[];
  badges?: string[];
  promoCode?: string | null;
  promoDiscountPercent?: number | null;
  status: 'draft' | 'active' | 'inactive';
  active: boolean;
  orderIndex: number;
  liveDemoUrl?: string | null;
  videoDemoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminDataset = {
  siteConfig: {
    siteId: string;
    siteName: string;
    brandName: string;
    layoutMode: 'gallery' | 'swipe' | 'grid';
    active: boolean;
    packageTier: 'starter' | 'studio' | 'pro' | 'enterprise' | 'custom';
    packageCardLimit: number;
    defaultCurrency: string;
    locale?: string;
    timezone?: string;
    customDomain?: string | null;
    contactEmail?: string | null;
    logo?: MediaRef | null;
    favicon?: MediaRef | null;
    heroTitle?: string;
    heroSubtitle?: string;
    tagline?: string;
    theme: {
      mode: 'light' | 'dark' | 'system';
      primaryColor?: string;
      accentColor?: string;
      background?: string;
      foreground?: string;
      surface?: string;
      border?: string;
    };
    fallbacks?: {
      useDesktopImagesOnMobile?: boolean;
    };
  };
  cards: GalleryCard[];
  commerceConfig: {
    provider: 'payme' | 'stripe' | 'placeholder';
    mode: 'test' | 'live';
    currency: string;
    publishableKey?: string;
    checkoutCreateUrl: string;
    checkoutStatusUrl: string;
    successUrlTemplate?: string;
    cancelUrlTemplate?: string;
    sourceApp: string;
    checkoutMode?: string;
    paymentMethods: string[];
    couponsEnabled?: boolean;
    subscriptionsEnabled?: boolean;
    taxMode?: string;
    webhookRef?: string;
    promos?: Record<string, unknown>;
    usdc: {
      receiveAddress: string;
      contract?: string;
      decimals?: number;
      chainId?: number;
    };
  };
  meta: {
    schemaVersion: string;
    generatedAt?: string;
    updatedAt: string;
    lastPublishedAt?: string;
    updatedBy?: string;
    source?: string;
    environment?: string;
    deploymentRef?: string;
    notes?: string;
  };
};

export type ValidationResult = {
  ok: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
};

export type LoadResult = {
  dataset: AdminDataset;
  validation: ValidationResult;
  source: 'storage' | 'default';
};
