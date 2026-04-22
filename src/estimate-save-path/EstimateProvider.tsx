import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type PropsWithChildren } from 'react';
import { getProductById, type Product } from '@/product-intake-model/Product';
import {
  deserializeEstimateState,
  estimateReducer,
  ESTIMATE_STORAGE_KEY,
  initialEstimateState,
  serializeEstimateState,
  resolveCheckoutProductId,
  type EstimateItem
} from '@/estimate-save-path/estimateState';

type EstimateContextValue = {
  items: EstimateItem[];
  activeProductId: string | null;
  checkoutProduct: Product | null;
  addProduct: (product: Product) => void;
  removeProduct: (productName: string) => void;
  hasProduct: (productName: string) => boolean;
  clearAll: () => void;
  setActiveProductId: (productId: string | null) => void;
  setCheckoutProductId: (productId: string | null) => void;
};

const EstimateContext = createContext<EstimateContextValue | undefined>(undefined);

function loadInitialEstimateState() {
  if (typeof window === 'undefined') return initialEstimateState;
  return deserializeEstimateState(window.localStorage.getItem(ESTIMATE_STORAGE_KEY));
}

export function EstimateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(estimateReducer, undefined, loadInitialEstimateState);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ESTIMATE_STORAGE_KEY, serializeEstimateState(state));
  }, [state]);

  const addProduct = useCallback((product: Product) => {
    dispatch({ type: 'add', product });
  }, []);

  const removeProduct = useCallback((productName: string) => {
    dispatch({ type: 'remove', productName });
  }, []);

  const hasProduct = useCallback((productName: string) => {
    return state.items.some((item) => item.product.name === productName);
  }, [state.items]);

  const clearAll = useCallback(() => dispatch({ type: 'clear' }), []);

  const setActiveProductId = useCallback((productId: string | null) => {
    dispatch({ type: 'setActiveProduct', productId });
  }, []);

  const setCheckoutProductId = useCallback((productId: string | null) => {
    dispatch({ type: 'setCheckoutProduct', productId });
  }, []);

  const checkoutProduct = useMemo(() => {
    const productId = resolveCheckoutProductId(state);
    return productId ? getProductById(productId) ?? null : null;
  }, [state]);

  const value = useMemo(
    () => ({
      items: state.items,
      activeProductId: state.activeProductId,
      checkoutProduct,
      addProduct,
      removeProduct,
      hasProduct,
      clearAll,
      setActiveProductId,
      setCheckoutProductId
    }),
    [state.items, state.activeProductId, checkoutProduct, addProduct, removeProduct, hasProduct, clearAll, setActiveProductId, setCheckoutProductId]
  );

  return <EstimateContext.Provider value={value}>{children}</EstimateContext.Provider>;
}

export function useEstimate() {
  const context = useContext(EstimateContext);
  if (!context) throw new Error('useEstimate must be used within EstimateProvider');
  return context;
}
