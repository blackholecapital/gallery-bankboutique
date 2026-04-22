import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  GLOBAL_PROMOS,
  getDiscountedSetupPrice,
  getProductById,
  productFixtures,
  slugifyProductName
} from '@/product-intake-model/Product';
import { RecommendedModulesStrip } from '@/recommended-modules-strip/RecommendedModulesStrip';
import { useEstimate } from '@/estimate-save-path/EstimateProvider';
import { ImageLightbox } from '@/product-media-module/ImageLightbox';

export function ExpandedProfileCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addProduct, hasProduct, activeProductId, setActiveProductId, setCheckoutProductId } = useEstimate();
  const cardRef = useRef<HTMLDivElement>(null);
  const product = useMemo(() => (id ? getProductById(id) : activeProductId ? getProductById(activeProductId) : productFixtures[0]), [activeProductId, id]);
  const otherProducts = useMemo(() => productFixtures.filter((p) => p.name !== product?.name), [product]);
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());
  const [activeImg, setActiveImg] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const clearConfirmTimer = useRef<number | null>(null);

  const handleImgError = useCallback((src: string) => {
    setFailedSrcs((prev) => new Set(prev).add(src));
  }, []);

  // Reset when product changes
  useEffect(() => {
    setActiveImg(0);
    setFailedSrcs(new Set());

    if (product) {
      setActiveProductId(slugifyProductName(product.name));
    }
  }, [id, product, setActiveProductId]);

  useEffect(() => {
    return () => {
      if (clearConfirmTimer.current) {
        window.clearTimeout(clearConfirmTimer.current);
      }
    };
  }, []);

  // Click outside card to go back to browse
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        navigate('/browse');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navigate]);

  if (!product) return <Navigate to="/browse" replace />;

  const validPairs = product.orderedImages
    .map((src, i) => ({
      desktop: src,
      mobile: product.orderedMobileImages?.[i] || src
    }))
    .filter((pair) => !failedSrcs.has(pair.desktop));
  const validImages = validPairs.map((p) => p.desktop);
  const validMobileImages = validPairs.map((p) => p.mobile);
  const heroSrc = validImages[activeImg] ?? validImages[0] ?? product.orderedImages[0];
  const discountedPrice = getDiscountedSetupPrice(product);
  const hasVideoDemo = Boolean(product.videoDemoUrl);

  return (
    <div ref={cardRef} className="animate-card-enter flex flex-col pb-0 rounded-[1.75rem] bg-[#f8f9fb] mx-2 mt-1 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.08),0_8px_28px_-6px_rgba(37,99,235,0.12)] border border-white/50">
      {/* Hero image — tap to enlarge */}
      <div className="px-4 pt-3">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="block w-full overflow-hidden rounded-[1.75rem] border border-blue-100/30 shadow-[0_4px_12px_-4px_rgba(37,99,235,0.14),0_12px_40px_-12px_rgba(37,99,235,0.10),0_2px_4px_rgba(0,0,0,0.04)] transition hover:shadow-[0_6px_16px_-4px_rgba(37,99,235,0.18),0_16px_48px_-12px_rgba(37,99,235,0.14),0_3px_6px_rgba(0,0,0,0.05)] hover:translate-y-[-1px]"
        >
          <img
            src={heroSrc}
            alt={`${product.name} hero`}
            className="aspect-[16/15] w-full cursor-zoom-in object-cover scale-[1.15]"
            onError={() => handleImgError(heroSrc)}
          />
        </button>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={validImages}
          mobileImages={validMobileImages}
          startIndex={activeImg}
          altText={product.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Content area */}
      <div className="flex-1 space-y-3 px-5 pt-4">
        {/* Title lockup + ID */}
        <div className="flex items-start justify-between gap-2 pb-0.5">
          <h1 className="text-[20px] font-black leading-tight tracking-[-0.02em] text-blue-600 drop-shadow-[0_1px_2px_rgba(37,99,235,0.38)] transition-colors hover:text-blue-700">{product.name}</h1>
          <span className="mt-1 shrink-0 rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-slate-500">
            ID {product.id}
          </span>
        </div>

        {/* Pricing line */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[13px]">
          <span className="font-bold text-slate-800">
            Setup ${product.setupPrice} · ${product.monthlyPrice}/{product.monthlyLabel ?? 'mo'}
          </span>
          {discountedPrice !== null && product.promoCode && (
            <span className="font-semibold text-orange-500">
              🔥 ${discountedPrice} with {product.promoCode} 🚀
            </span>
          )}
        </div>

        {/* DEMOS row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
          <span className="font-semibold uppercase tracking-wider text-slate-400">Demos:</span>
          {product.liveDemoUrl ? (
            <a
              href={product.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Live <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-300">Live</span>
          )}
          <span
            className={`inline-flex items-center gap-1 ${hasVideoDemo ? 'text-slate-600' : 'text-slate-300'}`}
            aria-disabled={!hasVideoDemo}
          >
            Video
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 6h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            Phone
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10a1 1 0 011 1v14a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1zm5 14h.01" />
            </svg>
          </span>
        </div>

        {/* What you get — bullet benefits */}
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">What you get</p>
        <ul className="space-y-2">
          {product.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <svg className="mt-[3px] h-3.5 w-3.5 shrink-0 text-blue-500" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0l2.5 5.3L16 6.2l-4 3.8 1 5.5L8 12.8l-5 2.7 1-5.5-4-3.8 5.5-.9z" />
              </svg>
              <span className="text-[13px] leading-snug text-slate-700">{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Global promo badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-600">
            🚀 {GLOBAL_PROMOS.launchParty.label} ({GLOBAL_PROMOS.launchParty.code})
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-600">
            🔥 {GLOBAL_PROMOS.usdc.label}
          </span>
        </div>

        {/* Recommended modules */}
        {otherProducts.length > 0 && (
          <div className="space-y-2.5 border-t border-slate-100/60 pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Recommended Modules</p>
            <RecommendedModulesStrip products={otherProducts} />
          </div>
        )}
      </div>

      {/* Thumbnail strip — lowered to card bottom for cleaner look */}
      {validImages.length > 1 && (
        <div className="thumb-rail flex gap-1 overflow-x-auto px-4 pt-3">
          {validImages.map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveImg(index)}
              className={`h-11 w-16 shrink-0 overflow-hidden rounded-md transition-all ${
                index === activeImg
                  ? 'ring-2 ring-blue-500/70 ring-offset-1'
                  : 'opacity-50 hover:opacity-90'
              }`}
            >
              <img
                src={img}
                alt={`${product.name} ${index + 1}`}
                className="h-full w-full object-cover"
                onError={() => handleImgError(img)}
              />
            </button>
          ))}
        </div>
      )}

      {/* Sticky CTA bar — clean icon+text, consistent with card actions */}
      <div className="sticky bottom-0 mt-3 border-t border-white/30 bg-white/70 px-6 pb-3 pt-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              addProduct(product);
              setActiveProductId(slugifyProductName(product.name));
              setShowConfirm(true);
              if (clearConfirmTimer.current) {
                window.clearTimeout(clearConfirmTimer.current);
              }
              clearConfirmTimer.current = window.setTimeout(() => setShowConfirm(false), 1500);
            }}
            disabled={hasProduct(product.name)}
            className="flex items-center gap-1.5 text-[13px] font-bold text-blue-600 transition-all hover:text-blue-700 active:scale-95 disabled:opacity-40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            {showConfirm ? 'Added!' : hasProduct(product.name) ? 'Saved' : 'Build'}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
                  </button>
          <button
            type="button"
            onClick={() => {
              const productId = slugifyProductName(product.name);
              setActiveProductId(productId);
              addProduct(product);
              setCheckoutProductId(productId);
              navigate('/cart');
            }}
            className="flex items-center gap-1 text-[13px] font-semibold text-slate-400 transition-colors hover:text-blue-600 active:scale-95"
          >
            Buy
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
