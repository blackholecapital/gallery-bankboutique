import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GLOBAL_PROMOS,
  getDiscountedSetupPrice,
  slugifyProductName,
  type Product
} from '@/product-intake-model/Product';
import { ImageLightbox } from '@/product-media-module/ImageLightbox';
import { useEstimate } from '@/estimate-save-path/EstimateProvider';

type InitialSwipeProductCardProps = {
  product: Product;
};

export function InitialSwipeProductCard({ product }: InitialSwipeProductCardProps) {
  const { setActiveProductId, addProduct, hasProduct, setCheckoutProductId } = useEstimate();
  const navigate = useNavigate();

  const productId = slugifyProductName(product.name);

  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleError = useCallback((src: string) => {
    setFailedSrcs((prev) => new Set(prev).add(src));
  }, []);

  // Reset active index when product changes
  useEffect(() => {
    setActiveIndex(0);
    setFailedSrcs(new Set());
  }, [product.orderedImages]);

  const validPairs = product.orderedImages
    .map((src, i) => ({
      desktop: src,
      mobile: product.orderedMobileImages?.[i] || src
    }))
    .filter((pair) => !failedSrcs.has(pair.desktop));
  const validImages = validPairs.map((p) => p.desktop);
  const validMobileImages = validPairs.map((p) => p.mobile);
  const heroSrc = validImages[activeIndex] ?? validImages[0];

  const goToProduct = () => {
    setActiveProductId(productId);
    navigate(product.actionPath);
  };

  if (validImages.length === 0) return null;

  const discountedPrice = getDiscountedSetupPrice(product);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={goToProduct}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToProduct();
        }
      }}
      className="cursor-pointer space-y-1.5 scale-[0.75] sm:scale-[0.975] origin-top rounded-[1.75rem] border border-white/50 bg-[#f8f9fb] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.08),0_8px_28px_-6px_rgba(37,99,235,0.20),0_0_40px_-8px_rgba(37,99,235,0.15)]"
    >
      {/* Hero image — tap to enlarge */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setLightboxOpen(true);
        }}
        className="block aspect-[32/15] w-full overflow-hidden rounded-xl border border-blue-100/30 shadow-[0_2px_10px_-3px_rgba(37,99,235,0.08),0_1px_2px_rgba(0,0,0,0.03)] transition hover:shadow-[0_2px_14px_-3px_rgba(37,99,235,0.14),0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <img
          src={heroSrc}
          alt={`${product.name} hero`}
          className="h-full w-full cursor-zoom-in object-cover scale-[1.15]"
          onError={() => handleError(heroSrc)}
        />
      </button>

      <div className="space-y-0.5 px-0.5">
        <div className="grid grid-cols-3 items-baseline gap-2">
          <p className="justify-self-start text-[14px] font-black leading-snug tracking-[-0.01em] text-blue-600 drop-shadow-[0_1px_2px_rgba(37,99,235,0.35)] transition-colors hover:text-blue-700">{product.name}</p>
          <p className="justify-self-center whitespace-nowrap text-[11px] font-bold text-slate-700">
            Setup ${product.setupPrice} · ${product.monthlyPrice}/{product.monthlyLabel ?? 'mo'}
          </p>
          <span className="justify-self-end font-mono text-[9px] font-semibold tracking-wide text-slate-400">ID {product.id}</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">{product.oneLinePromise}</p>
      </div>

      <div className="space-y-1 px-0.5 min-h-[150px]">
        <ul className="space-y-0.5">
          {product.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <svg className="mt-[2px] h-3 w-3 shrink-0 text-blue-500" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0l2.5 5.3L16 6.2l-4 3.8 1 5.5L8 12.8l-5 2.7 1-5.5-4-3.8 5.5-.9z" />
              </svg>
              <span className="text-[11px] leading-snug text-slate-600">{bullet}</span>
            </li>
          ))}
        </ul>
        <ul className="space-y-0.5 pt-1">
          <li className="flex items-start gap-2">
            <span className="mt-[1px] text-[11px] leading-none" aria-hidden="true">🚀</span>
            <span className="text-[11px] font-semibold leading-snug text-orange-600">
              {GLOBAL_PROMOS.launchParty.label} ({GLOBAL_PROMOS.launchParty.code})
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-[1px] text-[11px] leading-none" aria-hidden="true">🔥</span>
            <span className="text-[11px] font-semibold leading-snug text-orange-600">
              {GLOBAL_PROMOS.usdc.label} ({GLOBAL_PROMOS.usdc.code})
            </span>
          </li>
        </ul>
        {discountedPrice !== null && product.promoCode && (
          <p className="pt-1 text-[11px] font-semibold text-orange-500">
            🔥 ${discountedPrice} with {product.promoCode} 🚀
          </p>
        )}
      </div>

      {/* Action row — Build (+) at left edge, More centered, Buy (cart) at right edge */}
      <div className="grid grid-cols-3 items-center px-2 pt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            addProduct(product);
            setActiveProductId(productId);
          }}
          disabled={hasProduct(product.name)}
          aria-label="Add to build"
          className="flex items-center gap-0.5 justify-self-start text-[12px] font-bold text-blue-600 transition-all hover:text-blue-700 active:scale-95 disabled:opacity-40"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
        </button>
        <Link
          to={product.actionPath}
          onClick={(e) => {
            e.stopPropagation();
            setActiveProductId(productId);
          }}
          className="justify-self-center text-[12px] font-semibold text-blue-600 transition-colors hover:text-blue-700 active:scale-95"
        >
          More
       </Link>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveProductId(productId);
            addProduct(product);
            setCheckoutProductId(productId);
            navigate('/cart');
          }}
          aria-label="Buy"
          className="flex items-center justify-self-end text-slate-500 transition-colors hover:text-blue-600 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </button>
      </div>

      {/* Thumbnail strip — bottom of card for cleaner visual hierarchy */}
      {validImages.length > 1 && (
        <div className="thumb-rail flex gap-1 overflow-x-auto pt-1">
          {validImages.map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(index);
              }}
              className={`h-10 w-14 shrink-0 overflow-hidden rounded-md transition-all ${
                index === activeIndex
                  ? 'ring-2 ring-blue-500/70 ring-offset-1'
                  : 'opacity-50 hover:opacity-90'
              }`}
            >
              <img
                src={img}
                alt={`${product.name} ${index + 1}`}
                className="h-full w-full object-cover"
                onError={() => handleError(img)}
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <ImageLightbox
          images={validImages}
          mobileImages={validMobileImages}
          startIndex={activeIndex}
          altText={product.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
