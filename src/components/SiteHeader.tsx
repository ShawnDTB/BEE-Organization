import { LogoLockup } from './LogoLockup';
import { navItems } from '../content/siteContent';

type SiteHeaderProps = {
  currentPath: string;
};

function isCurrentPath(currentPath: string, href: string) {
  return currentPath === href || (href !== '/' && currentPath.startsWith(`${href}/`));
}

export function SiteHeader({ currentPath }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="announcement">
        <span>Custom orders, bulk programs, creator goods, and embroidery</span>
        <span className="announcement__status">Brand identity in development</span>
      </div>
      <div className="site-header__bar">
        <LogoLockup />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              className={isCurrentPath(currentPath, item.href) ? 'is-active' : undefined}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a className="button button--small header-cta" href="/start-order">Start an order</a>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <a href="/">Home</a>
            {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
            <a className="mobile-menu__cta" href="/start-order">Start an order</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
