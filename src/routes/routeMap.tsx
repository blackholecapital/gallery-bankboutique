import { Navigate, type RouteObject } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { HomePage } from '@/pages/home/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DiscoveryPage } from '@/pages/discovery/DiscoveryPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { routePaths } from '@/routes/paths';
import { EstimateSavePath } from '@/estimate-save-path/EstimateSavePath';
import { PayMeBoundary } from '@/checkout-path/PayMeBoundary';
import { CartPage } from '@/pages/cart/CartPage';
import { AdminPage } from '@/pages/admin/AdminPage';
import { CheckoutConfirmPage } from '@/pages/checkout/CheckoutConfirmPage';

export const appRoutes: RouteObject[] = [
  {
    path: routePaths.home,
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={routePaths.browse} replace /> },
      { path: routePaths.browse.slice(1), element: <DiscoveryPage /> },
      { path: `${routePaths.product.slice(1)}/:id?`, element: <ProfilePage /> },
      { path: routePaths.estimate.slice(1), element: <EstimateSavePath /> },
      { path: routePaths.cart.slice(1), element: <CartPage /> },
      { path: routePaths.admin.slice(1), element: <AdminPage /> },
      { path: routePaths.checkoutConfirm.slice(1), element: <CheckoutConfirmPage /> },
      { path: `${routePaths.checkout.slice(1)}/:productId?`, element: <div className="flex flex-1 flex-col px-4 py-4"><PayMeBoundary /></div> },
      { path: '*', element: <Navigate to={routePaths.browse} replace /> }
    ]
  },
  { path: '*', element: <Navigate to={routePaths.browse} replace /> }
];
