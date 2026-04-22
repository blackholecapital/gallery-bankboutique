import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/product-intake-model/Product';

export function RecommendedModulesStrip({ products }: { products: Product[] }) {
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());

  const handleError = useCallback((src: string) => {
    setFailedSrcs((prev) => new Set(prev).add(src));
  }, []);

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1">
      {products.map((product) => {
        const imgSrc = product.orderedImages[0];
        const isFailed = failedSrcs.has(imgSrc);
        return (
          <Link
            key={product.name}
            to={product.actionPath}
            className="flex w-[100px] shrink-0 flex-col overflow-hidden rounded-xl border border-white/30 bg-white/40 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition hover:border-blue-200 hover:shadow-md"
          >
            {isFailed ? (
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-slate-50 text-[10px] text-slate-300">
                {product.name[0]}
              </div>
            ) : (
              <img
                src={imgSrc}
                alt={product.name}
                className="aspect-[4/3] w-full object-cover"
                onError={() => handleError(imgSrc)}
              />
            )}
            <p className="px-2 py-1.5 text-[10px] font-semibold leading-tight text-slate-700">{product.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
