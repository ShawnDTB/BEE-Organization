import { useEffect, useMemo, useState } from 'react';
import { LogoLockup } from './LogoLockup';
import { navItems } from '../content/siteContent';

const CART_KEY = 'bee-project-bag-v1';
const CART_EVENT = 'bee-cart-updated';

type SiteHeaderProps = {
  currentPath: string;
};

function isCurrentPath(currentPath: string, href: string) {
  return currentPath === href || (href !== '/' && currentPath.startsWith(`${href}/`));
}

function readCartCount() {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

function contextualAction(path: string) {
  if (path.startsWith('/bulk-orders') || path.startsWith('/schools-organizations')) {
    return { label: 'Get a bulk quote', href: '/start-order?type=bulk' };
  }
  if (path.startsWith('/creator-merch')) {
    return { label: 'Plan a merch drop', href: '/start-order?type=creator' };
  }
  if (path.startsWith('/studio') || path.startsWith('/cart') || path.startsWith('/project-review')) {
    return { label: 'Open project bag', href: '/cart' };
  }
  return { label: 'Design custom apparel', href: '/studio' };
}

export function SiteHeader({ currentPath }: SiteHeaderProps) {
  const [cartCount, setCartCount] = useState(readCartCount);
  const action = useMemo(() => contextualAction(currentPath), [currentPath]);

  useEffect(() => {
    const sync = () => setCartCount(readCartCount());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return (
    <header className="site-header">
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

        <div className="header-commerce" aria-label="Customer tools">
          <a
            className={`header-commerce__link${isCurrentPath(currentPath, '/account') ? ' is-active' : ''}`}
            href="/account"
            aria-label="Customer account"
          >
            <span>Account</span>
          </a>
          <a
            className={`header-commerce__link${isCurrentPath(currentPath, '/cart') || isCurrentPath(currentPath, '/project-review') ? ' is-active' : ''}`}
            href="/cart"
            aria-label={`Project bag with ${cartCount} item${cartCount === 1 ? '' : 's'}`}
          >
            <span>Bag</span>
            {cartCount > 0 && <b className="header-commerce__count">{cartCount}</b>}
          </a>
        </div>

        <a className="button button--small header-cta" href={action.href}>{action.label}</a>

        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <a href="/">Home</a>
            {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
            <div className="mobile-menu__utility">
              <a href="/embroidery">Embroidery</a>
              <a href="/graphic-apparel">Graphic apparel</a>
              <a href="/account">Account</a>
              <a href="/cart">Project bag {cartCount > 0 ? `(${cartCount})` : ''}</a>
            </div>
            <a className="mobile-menu__cta" href={action.href}>{action.label}</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
