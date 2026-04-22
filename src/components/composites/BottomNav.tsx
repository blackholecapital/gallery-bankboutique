import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { routePaths } from '@/routes/paths';
import { useEstimate } from '@/estimate-save-path/EstimateProvider';
import { getProductById, productFixtures, slugifyProductName } from '@/product-intake-model/Product';

const actions = [
  {
    to: routePaths.browse,
    label: 'Browse',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    to: routePaths.estimate,
    label: 'Build',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
  },
  {
    to: routePaths.cart,
    label: 'Buy',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  },
];

const socials = [
  {
    href: 'https://www.youtube.com/@xyz-Labs-xyz',
    label: 'YouTube',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.5a3 3 0 00-2.12-2.12C19.5 4 12 4 12 4s-7.5 0-9.38.38A3 3 0 00.5 6.5C.12 8.38.12 12 .12 12s0 3.62.38 5.5a3 3 0 002.12 2.12C4.5 20 12 20 12 20s7.5 0 9.38-.38a3 3 0 002.12-2.12c.38-1.88.38-5.5.38-5.5s0-3.62-.38-5.5zM9.75 15.5v-7L15.75 12l-6 3.5z" />
      </svg>
    ),
  },
  {
    href: 'https://discord.com/invite/NyYT6YNWZJ',
    label: 'Discord',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.32 4.37A19.79 19.79 0 0016.56 3l-.23.27a15 15 0 00-1.5 1.92 18.4 18.4 0 00-5.66 0 15 15 0 00-1.5-1.92L7.44 3A19.79 19.79 0 003.68 4.37 20.48 20.48 0 00.24 17.93a19.92 19.92 0 006 3.05l.48-.67a13.63 13.63 0 01-2.15-1.05l.53-.42a14 14 0 0012.8 0l.53.42a13.55 13.55 0 01-2.16 1.05l.48.67a19.88 19.88 0 006-3.05A20.45 20.45 0 0020.32 4.37zM8.02 15.33a2.37 2.37 0 01-2.2-2.49 2.35 2.35 0 012.2-2.49 2.35 2.35 0 012.2 2.49 2.35 2.35 0 01-2.2 2.49zm7.96 0a2.37 2.37 0 01-2.2-2.49 2.35 2.35 0 012.2-2.49 2.34 2.34 0 012.2 2.49 2.35 2.35 0 01-2.2 2.49z" />
      </svg>
    ),
  },
  {
    href: 'https://x.com/Mktmakerxyz?s=21',
    label: 'X',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, activeProductId, addProduct, setCheckoutProductId } = useEstimate();
  const buildCount = items.length;

  // Build tab is visually highlighted on browse pages to guide "this is where you go next"
  const isBrowseArea = location.pathname === routePaths.browse || location.pathname.startsWith(routePaths.browse + '/');

  const handleBuyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isBrowseArea) return;
    const displayed =
      (activeProductId ? getProductById(activeProductId) : null) ?? productFixtures[0];
    if (!displayed) return;
    e.preventDefault();
    addProduct(displayed);
    setCheckoutProductId(slugifyProductName(displayed.name));
    navigate(routePaths.cart);
  };

  return (
    <nav className="shrink-0 px-2 pb-1 pt-1">
      {/* Nav tabs — Build is highlighted when on browse to guide flow */}
      <div className="grid grid-cols-3">
        {actions.map((action) => {
          const isPathActive = location.pathname === action.to || location.pathname.startsWith(action.to + '/');
          const isBuildTab = action.label === 'Build';
          const isHighlighted = isPathActive || (isBuildTab && isBrowseArea && buildCount > 0);
          const buildGlow = isBuildTab && buildCount > 0;
          return (
            <NavLink
              key={action.to}
              to={action.to}
              onClick={action.label === 'Buy' ? handleBuyClick : undefined}
              className={`flex min-h-9 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold transition-all hover:scale-[1.03] active:scale-[0.95] ${
                isHighlighted
                  ? 'font-bold text-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              } ${buildGlow ? 'animate-build-glow' : ''}`}
            >
              {action.icon}
              <span>{action.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Social links — one per Browse/Build/Buy column above */}
      <div className="mt-1 grid grid-cols-3">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex items-center justify-center text-slate-400 transition-colors hover:text-blue-600 active:scale-95"
          >
            {social.icon}
          </a>
        ))}
      </div>

      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
