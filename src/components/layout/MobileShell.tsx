import type { PropsWithChildren } from 'react';
import { BottomNav } from '@/components/composites/BottomNav';

type MobileShellProps = PropsWithChildren<{
  header?: React.ReactNode;
  hideNav?: boolean;
}>;

export function MobileShell({ children, header, hideNav }: MobileShellProps) {
  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-slate-100/80 sm:p-8">
      {/* Wallpaper layer — zoomed out on mobile, clearly visible */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.85] [background-image:var(--wallpaper)]"
        style={{ '--wallpaper': 'url(/wallpaper.png)' } as React.CSSProperties}
      />
      {/* Light tint overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-white/5" />
      {/* Subtle noise grain overlay — premium texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E")' }} />
      <div className="relative flex h-[100dvh] w-full max-w-[390px] flex-col overflow-hidden sm:h-[min(100dvh,844px)] sm:rounded-[2.5rem]">
        {header}
        <main className="flex-1 overflow-y-auto">{children}</main>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}
