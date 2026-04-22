import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { InitialSwipeProductCard } from '@/browse-surface/InitialSwipeProductCard';
import { productFixtures, slugifyProductName } from '@/product-intake-model/Product';
import { useEstimate } from '@/estimate-save-path/EstimateProvider';

export function BrowseSurfacePage() {
  const { activeProductId, setActiveProductId } = useEstimate();
  const initialIndex = useMemo(() => {
    if (!activeProductId) return 0;
    const foundIndex = productFixtures.findIndex((product) => slugifyProductName(product.name) === activeProductId);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [activeProductId]);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimer = useRef<number | null>(null);
  const total = productFixtures.length;

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  const goTo = useCallback((index: number, dir: 'left' | 'right') => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);

    if (animationTimer.current) {
      window.clearTimeout(animationTimer.current);
    }

    animationTimer.current = window.setTimeout(() => {
      setActiveIndex(index);
      setActiveProductId(slugifyProductName(productFixtures[index].name));
      setDirection(null);
      setIsAnimating(false);
    }, 250);
  }, [isAnimating, setActiveProductId]);

  const goNext = useCallback(() => {
    const nextIndex = (activeIndex + 1) % total;
    goTo(nextIndex, 'left');
  }, [activeIndex, total, goTo]);

  const goPrev = useCallback(() => {
    const prevIndex = (activeIndex - 1 + total) % total;
    goTo(prevIndex, 'right');
  }, [activeIndex, total, goTo]);

  useEffect(() => {
    return () => {
      if (animationTimer.current) {
        window.clearTimeout(animationTimer.current);
      }
    };
  }, []);

  // Keyboard arrows
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    const threshold = 50;
    if (touchDeltaX.current < -threshold) goNext();
    else if (touchDeltaX.current > threshold) goPrev();
  };

  const product = productFixtures[activeIndex];

  const animClass = direction === 'left'
    ? 'animate-slide-out-left'
    : direction === 'right'
      ? 'animate-slide-out-right'
      : 'animate-card-enter';

  return (
    <div className="flex flex-1 flex-col -mt-2">
      {/* Product title tabs — flanked by swipe arrows */}
      <div className="flex items-center gap-2 px-3 pb-1 pt-1.5">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous product"
          className="flex h-7 w-7 shrink-0 items-center justify-center text-blue-600 transition hover:text-blue-700 active:scale-95"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex flex-1 items-center justify-center">
          <span
            key={product.name}
            className="animate-card-enter whitespace-nowrap text-[14px] font-semibold text-blue-600"
          >
            {product.name}
          </span>
        </div>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next product"
          className="flex h-7 w-7 shrink-0 items-center justify-center text-blue-600 transition hover:text-blue-700 active:scale-95"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Card deck area */}
      <div
        ref={containerRef}
        className="relative flex flex-1 items-start justify-center overflow-hidden px-4 pb-2"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          key={activeIndex}
          className={`w-full ${animClass}`}
        >
          <InitialSwipeProductCard product={product} />
        </div>

        {/* Dot indicators — absolute bottom of deck area so they sit
            clearly below the scaled card, not overlapping the More row. */}
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
          {productFixtures.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all ${
                i === activeIndex
                  ? 'h-1.5 w-4 bg-blue-500'
                  : 'h-1.5 w-1.5 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
