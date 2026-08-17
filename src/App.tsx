import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';

function lazyNamed<T extends Record<string, ComponentType>, K extends keyof T>(loader: () => Promise<T>, name: K) {
  return lazy(async () => {
    const module = await loader();
    return { default: module[name] };
  });
}

const sitePages = () => import('./pages/SitePages');
const commercePages = () => import('./pages/CommercePages');

const HomePage = lazyNamed(sitePages, 'HomePage');
const BulkOrdersPage = lazyNamed(sitePages, 'BulkOrdersPage');
const EmbroideryPage = lazyNamed(sitePages, 'EmbroideryPage');
const GraphicApparelPage = lazyNamed(sitePages, 'GraphicApparelPage');
const CreatorMerchPage = lazyNamed(sitePages, 'CreatorMerchPage');
const OrganizationsPage = lazyNamed(sitePages, 'OrganizationsPage');
const PortfolioPage = lazyNamed(sitePages, 'PortfolioPage');
const AboutPage = lazyNamed(sitePages, 'AboutPage');
const StartOrderPage = lazyNamed(sitePages, 'StartOrderPage');
const NotFoundPage = lazyNamed(sitePages, 'NotFoundPage');

const CartPage = lazyNamed(commercePages, 'CartPage');
const ProjectReviewPage = lazyNamed(commercePages, 'ProjectReviewPage');
const RetailCheckoutPage = lazyNamed(commercePages, 'RetailCheckoutPage');
const AccountPage = lazyNamed(commercePages, 'AccountPage');

const ShopV2Page = lazy(() => import('./pages/ShopV2').then((module) => ({ default: module.ShopV2Page })));
const StudioPage = lazy(() => import('./pages/StudioPageV2').then((module) => ({ default: module.StudioPage })));
const GroupCollectorPage = lazy(() => import('./pages/GroupCollectorPage').then((module) => ({ default: module.GroupCollectorPage })));

type PageComponent = LazyExoticComponent<ComponentType>;

const routeMap: Record<string, PageComponent> = {
  '/': HomePage,
  '/shop': ShopV2Page,
  '/studio': StudioPage,
  '/cart': CartPage,
  '/project-review': ProjectReviewPage,
  '/checkout': RetailCheckoutPage,
  '/account': AccountPage,
  '/bulk-orders': BulkOrdersPage,
  '/group-collector': GroupCollectorPage,
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

function RouteLoading() {
  return <div className="route-loading" role="status" aria-live="polite"><span>Loading BEE</span><i /></div>;
}

function App() {
  const currentPath = normalizePath(window.location.pathname);
  const Page = routeMap[currentPath] ?? NotFoundPage;

  return (
    <div className="site-shell">
      <SiteHeader currentPath={currentPath} />
      <main>
        <Suspense fallback={<RouteLoading />}>
          <Page />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
