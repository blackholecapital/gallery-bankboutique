export type ProductMediaPair = {
  desktop: string;
  mobile: string;
};

export type Product = {
  id: string;
  name: string;
  oneLinePromise: string;
  buyerOutcome: string;
  actionPath: string;
  orderedImages: string[];
  orderedMobileImages?: (string | null)[];
  bullets: [string, string, string, ...string[]];
  price: number;
  setupPrice: number;
  monthlyPrice: number;
  monthlyLabel?: string;
  liveDemoUrl?: string;
  videoDemoUrl?: string | null;
  promoCode?: string;
  promoDiscountPercent?: number;
};

export const GLOBAL_PROMOS = {
  launchParty: { code: 'LAUNCH30', percentOff: 30, label: 'Launch Party — 30% OFF' },
  usdc: { code: 'USDC', percentOff: 10, label: 'Extra 10% OFF with USDC on Everything' }
} as const;

const defaultProductFixtures: Product[] = [
  {
    id: 'xyz.0444',
    name: 'Studio',
    oneLinePromise: 'Design and deploy polished business pages fast.',
    buyerOutcome: 'Go from idea to live page in minutes with drag-and-drop tools.',
    actionPath: '/product/studio',
    orderedImages: [
      '/Studio1.png',
      '/Studio2.png',
      '/Studio3.png',
      '/Studio4.png',
      '/Studio5.png',
      '/Studio6.png'
    ],
    bullets: [
      'Drag-and-drop page builder with real-time preview',
      'Polished launch surfaces for any product or service',
      'Branded page templates with custom fonts and colors',
      'One-click deploy to your own domain',
      'Mobile-responsive output by default'
    ],
    price: 199,
    setupPrice: 199,
    monthlyPrice: 20,
    liveDemoUrl: 'https://showroom.xyz-labs.xyz/profile/studio',
    promoCode: 'SAVE30',
    promoDiscountPercent: 30
  },
  {
    id: 'xyz.0445',
    name: 'Gateway',
    oneLinePromise: 'Your web business front end, ready to run.',
    buyerOutcome: 'Launch a complete storefront with checkout and customer tools built in.',
    actionPath: '/product/gateway',
    orderedImages: [
      '/Gateway1.png',
      '/Gateway2.png',
      '/Gateway3.png',
      '/Gateway4.png',
      '/Gateway5.png',
      '/Gateway6.png',
      '/Gateway7.png'
    ],
    bullets: [
      'Integrated checkout and payment processing',
      'Built-in customer service area with ticket routing',
      'Business-in-a-box setup with guided onboarding',
      'Upgrade-ready customer flows for subscriptions and upsells'
    ],
    price: 999,
    setupPrice: 999,
    monthlyPrice: 20,
    liveDemoUrl: 'https://showroom.xyz-labs.xyz/profile/gateway',
    promoCode: 'SAVE30',
    promoDiscountPercent: 30
  },
  {
    id: 'xyz.0446',
    name: 'Connect',
    oneLinePromise: 'A social framework for branded audience engagement.',
    buyerOutcome: 'Grow and engage your audience from one branded hub.',
    actionPath: '/product/connect',
    orderedImages: [
      '/connect1.png',
      '/connect2.png',
      '/connect3.png',
      '/connect4.png',
      '/connect6.png'
    ],
    bullets: [
      'Community touchpoints across web, mobile, and social',
      'Branded interaction surfaces with your look and feel',
      'Built-in audience growth tools and referral tracking',
      'Social presentation layer for content and announcements'
    ],
    price: 99,
    setupPrice: 99,
    monthlyPrice: 10,
    liveDemoUrl: 'https://showroom.xyz-labs.xyz/profile/connect',
    promoCode: 'SAVE30',
    promoDiscountPercent: 30
  },
  {
    id: 'xyz.0447',
    name: 'PayMe Pro',
    oneLinePromise: 'Modern commerce with built-in promotion and customer tools.',
    buyerOutcome: 'Sell more with flexible checkout, coupons, and customer insights.',
    actionPath: '/product/payme-pro',
    orderedImages: [
      '/paymepro1.png',
      '/paymepro2.png',
      '/paymepro3.png',
      '/paymepro4.png',
      '/paymepro5.png',
      '/paymepro6.png'
    ],
    bullets: [
      'Flexible selling with one-time and recurring checkout flows',
      'Coupon codes and promotional pricing built in',
      'Streamlined checkout with saved payment methods',
      'Light CRM with customer profiles and purchase history'
    ],
    price: 199,
    setupPrice: 199,
    monthlyPrice: 10,
    liveDemoUrl: 'https://showroom.xyz-labs.xyz/profile/payme-pro',
    promoCode: 'SAVE30',
    promoDiscountPercent: 30
  },
  {
    id: 'xyz.0448',
    name: 'Message Track',
    oneLinePromise: 'Real-time message tracking for a clean, client-facing surface.',
    buyerOutcome: 'Share live status and updates on a lightweight, branded page.',
    actionPath: '/product/message-track',
    orderedImages: ['/mt1.png', '/mt2.png', '/mt3.png', '/mt4.png', '/mt5.png'],
    orderedMobileImages: ['/mt1m.jpeg', '/mt2m.jpeg', '/mt3m.jpeg', '/mt4m.png', '/mt5m.jpeg'],
    bullets: [
      'Real-time message tracking surface',
      'Lightweight client-facing status page',
      'Built for fast updates + clean UI'
    ],
    price: 199,
    setupPrice: 199,
    monthlyPrice: 20,
    liveDemoUrl: 'https://message-track.xyz-labs.xyz/',
    promoCode: 'SAVE30',
    promoDiscountPercent: 30
  },
  {
    id: 'xyz.0449',
    name: 'Showroom',
    oneLinePromise: 'A premium 3D-depth landing surface for showcase offers.',
    buyerOutcome: 'Launch a showroom-style page with tiles, PayMe checkout, and admin.',
    actionPath: '/product/showroom',
    orderedImages: ['/sho1.png', '/Sho2.png', '/Sho3.png'],
    orderedMobileImages: ['/sho1m.png', '/sho2m.png', '/sho3m.png'],
    bullets: [
      'Premium product placement landing page (3D depth / showroom feel)',
      'Product tiles + "PayMe" checkout built-in',
      'Admin page + multiple payment options',
      'Micro-sales system optimized for premium offers'
    ],
    price: 199,
    setupPrice: 199,
    monthlyPrice: 20,
    liveDemoUrl: 'https://showroom.xyz-labs.xyz/',
    promoCode: 'SAVE30',
    promoDiscountPercent: 30
  },
  {
    id: 'xyz.0450',
    name: 'Gallery',
    oneLinePromise: 'A gallery-style landing surface for premium product drops.',
    buyerOutcome: 'Present product tiles in a polished gallery with PayMe checkout.',
    actionPath: '/product/gallery',
    orderedImages: ['/gal1.png', '/gal2.png', '/gal3.png'],
    orderedMobileImages: [null, '/gal2m.png', '/gal3m.png'],
    bullets: [
      'Premium product placement landing page (gallery-style presentation)',
      'Product tiles + "PayMe" checkout built-in',
      'Admin page + multiple payment options',
      'Micro-sales system for premium product drops'
    ],
    price: 199,
    setupPrice: 199,
    monthlyPrice: 20,
    liveDemoUrl: 'https://gallery.xyz-labs.xyz/browse',
    promoCode: 'SAVE30',
    promoDiscountPercent: 30
  },
  {
    id: 'xyz.0451',
    name: 'Biz Pages',
    oneLinePromise: 'Business pages with customer area and light CRM.',
    buyerOutcome: 'Ship a 3-page business site with a customer area and admin flow.',
    actionPath: '/product/biz-pages',
    orderedImages: ['/Biz1.png', '/Biz2.png', '/biz3.png'],
    bullets: [
      'Business pages system (Gateway-style layout without Web3 interface)',
      '3 customizable pages + Customer area',
      'PayMe Pro light CRM features',
      'Built for services/products with admin + customer flow'
    ],
    price: 599,
    setupPrice: 599,
    monthlyPrice: 20,
    liveDemoUrl: 'https://bizpages.xyz-labs.xyz/home',
    promoCode: 'SAVE30',
    promoDiscountPercent: 30
  },
  {
    id: 'xyz.0452',
    name: 'Stickers',
    oneLinePromise: 'A customizable stickers app for schools, groups, and clubs.',
    buyerOutcome: 'Launch a fun sticker experience your audience can customize and share.',
    actionPath: '/product/stickers',
    orderedImages: ['/stick1.png', '/Stick2.png', '/Stick3.png'],
    orderedMobileImages: ['/stick1m.png', '/stick2m.png', null],
    bullets: [
      'Customizable stickers app/game for school, group, or club',
      'Simple guided customization flow',
      'Designed for fun engagement + easy sharing'
    ],
    price: 199,
    setupPrice: 199,
    monthlyPrice: 10,
    liveDemoUrl: 'https://stickers.xyz-labs.xyz/',
    promoCode: 'SAVE30',
    promoDiscountPercent: 30
  }
];

type AdminDatasetCard = {
  id: string;
  title: string;
  tagline: string;
  outcome: string;
  bullets: string[];
  status: 'draft' | 'active' | 'inactive';
  active: boolean;
  orderIndex: number;
  liveDemoUrl?: string | null;
  videoDemoUrl?: string | null;
  promoCode?: string | null;
  promoDiscountPercent?: number | null;
  pricing: {
    setup: number;
    monthly: number;
    intervalLabel?: string;
  };
  media: Array<{ role: string; orderIndex: number; url?: string; r2Key?: string }>
  mainImage?: { url?: string; r2Key?: string };
};

type AdminDatasetLike = {
  cards?: AdminDatasetCard[];
};

const ADMIN_DATASET_STORAGE_KEY = 'artist-connect.admin.dataset.v1';

function toRenderableAsset(url?: string, r2Key?: string): string | null {
  if (url && url.trim()) return url.trim();
  if (!r2Key || !r2Key.trim()) return null;
  const filename = r2Key.split('/').filter(Boolean).pop();
  return filename ? `/${filename}` : null;
}

function adaptAdminCardToProduct(card: AdminDatasetCard): Product {
  const gallery = card.media
    .filter((item) => item.role === 'gallery')
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((item) => toRenderableAsset(item.url, item.r2Key))
    .filter((item): item is string => Boolean(item));

  const mobile = card.media
    .filter((item) => item.role === 'mobile')
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((item) => toRenderableAsset(item.url, item.r2Key));

  const mainImage = toRenderableAsset(card.mainImage?.url, card.mainImage?.r2Key);
  const orderedImages = gallery.length > 0 ? gallery : mainImage ? [mainImage] : defaultProductFixtures[0].orderedImages;
  const orderedMobileImages = mobile.length > 0 ? mobile : undefined;

  return {
    id: card.id,
    name: card.title,
    oneLinePromise: card.tagline,
    buyerOutcome: card.outcome,
    actionPath: `/product/${slugifyProductName(card.title)}`,
    orderedImages,
    orderedMobileImages,
    bullets: card.bullets.length >= 3
      ? ([card.bullets[0], card.bullets[1], card.bullets[2], ...card.bullets.slice(3)] as [string, string, string, ...string[]])
      : ['Coming soon', 'Coming soon', 'Coming soon'],
    price: card.pricing.setup,
    setupPrice: card.pricing.setup,
    monthlyPrice: card.pricing.monthly,
    monthlyLabel: card.pricing.intervalLabel,
    liveDemoUrl: card.liveDemoUrl ?? undefined,
    videoDemoUrl: card.videoDemoUrl ?? null,
    promoCode: card.promoCode ?? undefined,
    promoDiscountPercent: card.promoDiscountPercent ?? undefined,
  };
}

function resolveRuntimeProducts(): Product[] {
  if (typeof window === 'undefined') return defaultProductFixtures;
  const raw = window.localStorage.getItem(ADMIN_DATASET_STORAGE_KEY);
  if (!raw) return defaultProductFixtures;

  try {
    const parsed = JSON.parse(raw) as AdminDatasetLike;
    const activeCards = (parsed.cards ?? [])
      .filter((card) => card.status === 'active' && card.active)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    if (activeCards.length === 0) return defaultProductFixtures;
    return activeCards.map(adaptAdminCardToProduct);
  } catch {
    return defaultProductFixtures;
  }
}

export const productFixtures: Product[] = resolveRuntimeProducts();

export function getProductById(id: string): Product | undefined {
  return productFixtures.find(
    (item) => slugifyProductName(item.name) === id || item.id === id
  );
}

export function slugifyProductName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getMobileImageFor(product: Product, index: number): string {
  const mobile = product.orderedMobileImages?.[index];
  if (mobile) return mobile;
  return product.orderedImages[index];
}

export function getDiscountedSetupPrice(product: Product): number | null {
  if (!product.promoDiscountPercent) return null;
  const discounted = product.setupPrice * (1 - product.promoDiscountPercent / 100);
  return Math.round(discounted);
}
