import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';

const HomePage = lazy(() => import('./pages/HomePageV4').then((module) => ({ default: module.HomePageV4 })));
const BulkOrdersPage = lazy(() => import('./pages/BulkOrdersPageV2').then((module) => ({ default: module.BulkOrdersPageV2 })));
const EmbroideryPage = lazy(() => import('./pages/PublicPagesV2').then((module) => ({ default: module.EmbroideryPageV2 })));
const GraphicApparelPage = lazy(() => import('./pages/PublicPagesV2').then((module) => ({ default: module.GraphicApparelPageV2 })));
const CreatorMerchPage = lazy(() => import('./pages/PublicPagesV2').then((module) => ({ default: module.CreatorMerchPageV2 })));
const PortfolioPage = lazy(() => import('./pages/PublicPagesV2').then((module) => ({ default: module.PortfolioPageV2 })));
const AboutPage = lazy(() => import('./pages/PublicPagesV2').then((module) => ({ default: module.AboutPageV2 })));
const StartOrderPage = lazy(() => import('./pages/SitePages').then((module) => ({ default: module.StartOrderPage })));
const NotFoundPage = lazy(() => import('./pages/SitePages').then((module) => ({ default: module.NotFoundPage })));

const CartPage = lazy(() => import('./pages/CommercePages').then((module) => ({ default: module.CartPage })));
const ProjectReviewPage = lazy(() => import('./pages/CommercePages').then((module) => ({ default: module.ProjectReviewPage })));
const RetailCheckoutPage = lazy(() => import('./pages/CommercePages').then((module) => ({ default: module.RetailCheckoutPage })));
const AccountPage = lazy(() => import('./pages/AccountPageV4').then((module) => ({ default: module.AccountPageV4 })));

const ShopV2Page = lazy(() => import('./pages/ShopV2').then((module) => ({ default: module.ShopV2Page })));
const StudioPage = lazy(() => import('./pages/StudioPageV3').then((module) => ({ default: module.StudioPageV3 })));
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
  '/schools-organizations': BulkOrdersPage,
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
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader currentPath={currentPath} />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<RouteLoading />}>
          <Page />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
