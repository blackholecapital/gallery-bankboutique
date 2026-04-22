import { getProductById, productFixtures, slugifyProductName, type Product } from '@/product-intake-model/Product';

export const ESTIMATE_STORAGE_KEY = 'artist-connect.estimate.v1';

export type EstimateItem = {
  product: Product;
  addedAt: number;
};

export type PersistedEstimateItem = {
  productId: string;
  addedAt: number;
};

export type EstimateState = {
  items: EstimateItem[];
  activeProductId: string | null;
  checkoutProductId: string | null;
};

type PersistedEstimateState = {
  items?: PersistedEstimateItem[];
  activeProductId?: string | null;
  checkoutProductId?: string | null;
};

export const initialEstimateState: EstimateState = {
  items: [],
  activeProductId: slugifyProductName(productFixtures[0]?.name ?? '') || null,
  checkoutProductId: null
};

function normalizeProductId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const id = value.trim();
  if (!id) return null;
  return getProductById(id) ? id : null;
}

export function deserializeEstimateState(raw: string | null | undefined): EstimateState {
  if (!raw) return initialEstimateState;

  try {
    const parsed = JSON.parse(raw) as PersistedEstimateState;
    const persistedItems = Array.isArray(parsed.items) ? parsed.items : [];

    const dedupedByName = new Map<string, EstimateItem>();
    for (const persisted of persistedItems) {
      if (!persisted || typeof persisted !== 'object') continue;
      const product = getProductById((persisted as PersistedEstimateItem).productId);
      if (!product) continue;

      const addedAt = Number((persisted as PersistedEstimateItem).addedAt);
      dedupedByName.set(product.name, {
        product,
        addedAt: Number.isFinite(addedAt) ? addedAt : Date.now()
      });
    }

    return {
      items: [...dedupedByName.values()],
      activeProductId: normalizeProductId(parsed.activeProductId) ?? initialEstimateState.activeProductId,
      checkoutProductId: normalizeProductId(parsed.checkoutProductId)
    };
  } catch {
    return initialEstimateState;
  }
}

export function serializeEstimateState(state: EstimateState): string {
  return JSON.stringify({
    items: state.items.map((item) => ({ productId: slugifyProductName(item.product.name), addedAt: item.addedAt })),
    activeProductId: state.activeProductId,
    checkoutProductId: state.checkoutProductId
  });
}


export function resolveCheckoutProductId(state: EstimateState, routeProductId?: string | null): string | null {
  const fromRoute = normalizeProductId(routeProductId);
  if (fromRoute) return fromRoute;

  const fromCheckout = normalizeProductId(state.checkoutProductId);
  if (fromCheckout) return fromCheckout;

  if (state.items.length > 0) {
    return slugifyProductName(state.items[state.items.length - 1].product.name);
  }

  return normalizeProductId(state.activeProductId);
}

export type EstimateAction =
  | { type: 'add'; product: Product }
  | { type: 'remove'; productName: string }
  | { type: 'clear' }
  | { type: 'setActiveProduct'; productId: string | null }
  | { type: 'setCheckoutProduct'; productId: string | null };

export function estimateReducer(state: EstimateState, action: EstimateAction): EstimateState {
  switch (action.type) {
    case 'add': {
      if (state.items.some((item) => item.product.name === action.product.name)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, addedAt: Date.now() }],
        activeProductId: slugifyProductName(action.product.name)
      };
    }
    case 'remove': {
      const remainingItems = state.items.filter((item) => item.product.name !== action.productName);
      const removedProductId = slugifyProductName(action.productName);
      const checkoutProductId = state.checkoutProductId === removedProductId ? null : state.checkoutProductId;

      return {
        ...state,
        items: remainingItems,
        checkoutProductId
      };
    }
    case 'clear':
      return {
        ...state,
        items: [],
        checkoutProductId: null
      };
    case 'setActiveProduct':
      return {
        ...state,
        activeProductId: normalizeProductId(action.productId) ?? state.activeProductId
      };
    case 'setCheckoutProduct':
      return {
        ...state,
        checkoutProductId: normalizeProductId(action.productId)
      };
    default:
      return state;
  }
}
