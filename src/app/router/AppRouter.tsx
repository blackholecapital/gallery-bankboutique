import { RouterProvider } from 'react-router-dom';
import { appRouter } from '@/app/router/createAppRouter';

export function AppRouter() {
  return <RouterProvider router={appRouter} />;
}
