import type { ComponentType } from 'react';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import {
  AccountPage,
  CartPage,
  CheckoutPage,
  ShopPage,
  ShopProductPage,
} from './pages/CommercePages';
import {
  AboutPage,
  BulkOrdersPage,
  CreatorMerchPage,
  EmbroideryPage,
  GraphicApparelPage,
  HomePage,
  NotFoundPage,
  OrganizationsPage,
  PortfolioPage,
  StartOrderPage,
} from './pages/SitePages';

const routeMap: Record<string, ComponentType> = {
  '/': HomePage,
  '/shop': ShopPage,
  '/cart': CartPage,
  '/checkout': CheckoutPage,
  '/account': AccountPage,
  '/bulk-orders': BulkOrdersPage,
  '/embroidery': EmbroideryPage,
  '/graphic-apparel': GraphicApparelPage,
  '/creator-merch': CreatorMerchPage,
  '/schools-organizations': OrganizationsPage,
  '/our-work': PortfolioPage,
  '/about': AboutPage,
  '/start-order': StartOrderPage,
};

function normalizePath(pathname: string) {
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '');
}

function resolvePage(currentPath: string): ComponentType {
  if (currentPath.startsWith('/shop/')) return ShopProductPage;
  return routeMap[currentPath] ?? NotFoundPage;
}

function App() {
  const currentPath = normalizePath(window.location.pathname);
  const Page = resolvePage(currentPath);

  return (
    <div className="site-shell">
      <SiteHeader currentPath={currentPath} />
      <main>
        <Page />
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
