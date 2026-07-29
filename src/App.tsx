import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
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

const routeMap: Record<string, () => JSX.Element> = {
  '/': HomePage,
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

function App() {
  const currentPath = normalizePath(window.location.pathname);
  const Page = routeMap[currentPath] ?? NotFoundPage;

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
