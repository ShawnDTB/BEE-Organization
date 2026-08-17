import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';

const HomePage = lazy(() => import('./pages/SitePages').then((module) => ({ default: module.HomePage })));
const BulkOrdersPage = lazy(() => import('./pages/SitePages').then((module) => ({ default: module.BulkOrdersPage })));
const EmbroideryPage = lazy(() => import('./pages/SitePages').then((module) => ({ default: module.EmbroideryPage })));
const GraphicApparelPage = lazy(() => import('./pages/SitePages').then((module) => ({ default: module.GraphicApparelPage })));
const CreatorMerchPage = lazy(() => import('./pages/SitePages').then((module) => ({ default: module.CreatorMerchPage })));
const OrganizationsPage = lazy(() => import('./pages/SitePages').then((module) => ({ default: module.OrganizationsPage })));
const PortfolioPage = lazy(() => import('./pages/SitePages').then((module) => ({ default: module.PortfolioPage })));
const AboutPage = lazy(() => import('./pages/SitePages').then((module) => ({ default: module.AboutPage })));
const StartOrderPage = lazy(() => import('./pages/SitePages').then((module) => ({ default: module.StartOrderPage })));
const NotFoundPage = lazy(() => import('./pages/SitePages').then((module) => ({ default: module.NotFoundPage })));

const CartPage = lazy(() => import('./pages/CommercePages').then((module) => ({ default: module.CartPage })));
const ProjectReviewPage = lazy(() => import('./pages/CommercePages').then((module) => ({ default: module.ProjectReviewPage })));
const RetailCheckoutPage = lazy(() => import('./pages/CommercePages').then((module) => ({ default: module.RetailCheckoutPage })));
const AccountPage = lazy(() => import('./pages/CommercePages').then((module) => ({ default: module.AccountPage })));

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
