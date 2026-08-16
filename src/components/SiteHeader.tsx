import { useEffect, useState } from 'react';
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

export function SiteHeader({ currentPath }: SiteHeaderProps) {
  const [cartCount, setCartCount] = useState(readCartCount);

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
      <div className="announcement">
        <span>Custom orders, bulk programs, creator goods, and embroidery</span>
        <span className="announcement__status">Brand identity in development</span>
      </div>
      <div className="site-header__bar">
        <LogoLockup />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a className={isCurrentPath(currentPath, '/shop') ? 'is-active' : undefined} href="/shop">Shop</a>
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
          <a className={`header-commerce__link${isCurrentPath(currentPath, '/account') ? ' is-active' : ''}`} href="/account"><span>Account</span></a>
          <a className={`header-commerce__link${isCurrentPath(currentPath, '/cart') || isCurrentPath(currentPath, '/checkout') ? ' is-active' : ''}`} href="/cart"><span>Bag</span><b className="header-commerce__count">{cartCount}</b></a>
        </div>
        <a className="button button--small header-cta" href="/start-order">Start an order</a>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <a href="/">Home</a>
            <a href="/shop">Shop</a>
            <a href="/account">Customer dashboard</a>
            <a href="/cart">Project bag ({cartCount})</a>
            {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
            <a className="mobile-menu__cta" href="/start-order">Start an order</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
