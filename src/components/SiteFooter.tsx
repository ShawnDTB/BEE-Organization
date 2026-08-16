import { LogoLockup } from './LogoLockup';
import { navItems, siteConfig } from '../content/siteContent';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__lead">
        <LogoLockup compact />
        <p>{siteConfig.primaryMessage}</p>
        <a className="button" href="/shop">Explore the shop</a>
      </div>
      <div className="site-footer__grid">
        <div>
          <h2>Services</h2>
          <a href="/bulk-orders">Bulk orders</a>
          <a href="/embroidery">Embroidery</a>
          <a href="/graphic-apparel">Graphic apparel</a>
          <a href="/creator-merch">Creator merchandise</a>
        </div>
        <div>
          <h2>Shop & account</h2>
          <a href="/shop">Shop catalog</a>
          <a href="/cart">Project bag</a>
          <a href="/account">Customer dashboard</a>
          <a href="/start-order">Start a custom request</a>
        </div>
        <div>
          <h2>Company</h2>
          {navItems.slice(4).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </div>
        <div>
          <h2>Platform status</h2>
          <span>{siteConfig.brandStatus}</span>
          <span>The shopping and customer-account interfaces are in active development.</span>
          <span>Live inventory, pricing, authentication, payments, and production data are not connected yet.</span>
        </div>
      </div>
      <div className="site-footer__legal">
        <span>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</span>
        <span>Website strategy and development by Designed to Breakthrough LLC.</span>
      </div>
    </footer>
  );
}
