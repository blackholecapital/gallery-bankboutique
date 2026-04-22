import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ImageLightboxProps = {
  images: string[];
  mobileImages?: (string | null)[];
  startIndex: number;
  altText: string;
  onClose: () => void;
};

export function ImageLightbox({ images, mobileImages, startIndex, altText, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const goNext = useCallback(() => {
    setIndex((i) => (i < images.length - 1 ? i + 1 : i));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (touchDeltaX.current < -50) goNext();
    else if (touchDeltaX.current > 50) goPrev();
  };

  const desktopSrc = images[index];
  const mobileSrc = mobileImages?.[index] || desktopSrc;
  const showPair = Boolean(mobileImages && mobileImages.length > 0);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
        {index + 1} / {images.length}
      </div>

      {index > 0 && (
        <button
          className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          aria-label="Previous image"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {index < images.length - 1 && (
        <button
          className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          aria-label="Next image"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {showPair ? (
        <div
          className="flex max-h-[85vh] max-w-[92vw] items-center gap-4"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex flex-col items-center gap-2">
            <img
              src={desktopSrc}
              alt={`${altText} desktop ${index + 1}`}
              className="max-h-[80vh] max-w-[62vw] rounded-lg object-contain"
              draggable={false}
            />
            <span className="text-[10px] uppercase tracking-wider text-white/60">Desktop</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img
              src={mobileSrc}
              alt={`${altText} mobile ${index + 1}`}
              className="max-h-[80vh] max-w-[26vw] rounded-lg object-contain"
              draggable={false}
            />
            <span className="text-[10px] uppercase tracking-wider text-white/60">Mobile</span>
          </div>
        </div>
      ) : (
        <img
          src={desktopSrc}
          alt={`${altText} ${index + 1}`}
          className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          draggable={false}
        />
      )}
    </div>,
    document.body
  );
}
