import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const action = useMemo(() => contextualAction(currentPath), [currentPath]);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sync = () => setCartCount(readCartCount());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    const closeOutside = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutside);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOutside);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <LogoLockup />

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = isCurrentPath(currentPath, item.href);
            return <a key={item.href} className={active ? 'is-active' : undefined} href={item.href} aria-current={active ? 'page' : undefined}>{item.label}</a>;
          })}
        </nav>

        <div className="header-commerce" aria-label="Customer tools">
          <a className={`header-commerce__link${isCurrentPath(currentPath, '/account') ? ' is-active' : ''}`} href="/account" aria-current={isCurrentPath(currentPath, '/account') ? 'page' : undefined}><span>Account</span></a>
          <a className={`header-commerce__link${isCurrentPath(currentPath, '/cart') || isCurrentPath(currentPath, '/project-review') ? ' is-active' : ''}`} href="/cart" aria-label={`Project bag with ${cartCount} item${cartCount === 1 ? '' : 's'}`}><span>Bag</span>{cartCount > 0 && <b className="header-commerce__count">{cartCount}</b>}</a>
        </div>

        <a className="button button--small header-cta" href={action.href}>{action.label}</a>

        <div className="mobile-menu" ref={menuRef}>
          <button ref={triggerRef} className="mobile-menu__trigger" type="button" aria-expanded={menuOpen} aria-controls="mobile-site-menu" onClick={() => setMenuOpen((open) => !open)}>
            <span>{menuOpen ? 'Close' : 'Menu'}</span><b aria-hidden="true">{menuOpen ? '×' : '☰'}</b>
          </button>

          <div id="mobile-site-menu" className="mobile-menu__panel" hidden={!menuOpen}>
            <nav aria-label="Site menu">
              <div className="mobile-menu__primary">
                <a href="/" onClick={closeMenu} aria-current={currentPath === '/' ? 'page' : undefined}>Home</a>
                {navItems.map((item) => {
                  const active = isCurrentPath(currentPath, item.href);
                  return <a key={item.href} href={item.href} onClick={closeMenu} aria-current={active ? 'page' : undefined}>{item.label}</a>;
                })}
              </div>
              <div className="mobile-menu__secondary">
                <a href="/embroidery" onClick={closeMenu}>Embroidery</a>
                <a href="/graphic-apparel" onClick={closeMenu}>Graphic apparel</a>
              </div>
              <div className="mobile-menu__utility">
                <a href="/account" onClick={closeMenu}>Account</a>
                <a href="/cart" onClick={closeMenu}>Project bag {cartCount > 0 ? `(${cartCount})` : ''}</a>
              </div>
              <a className="mobile-menu__cta" href={action.href} onClick={closeMenu}>{action.label}</a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
