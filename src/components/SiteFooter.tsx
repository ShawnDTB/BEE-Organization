import { LogoLockup } from './LogoLockup';
import { navItems, siteConfig } from '../content/siteContent';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__lead">
        <LogoLockup compact />
        <p>{siteConfig.primaryMessage}</p>
        <a className="button" href="/start-order">Start a project</a>
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
          <h2>Company</h2>
          {navItems.slice(4).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          <a href="/start-order">Start an order</a>
        </div>
        <div>
          <h2>Order support</h2>
          <span>Quotes and artwork review</span>
          <span>Proof approval</span>
          <span>Size and quantity organization</span>
          <span>Reorder preparation</span>
        </div>
        <div>
          <h2>Status</h2>
          <span>{siteConfig.brandStatus}</span>
          <span>Commerce and automated submission are in development.</span>
          <span>No public pricing or turnaround guarantees are published yet.</span>
        </div>
      </div>
      <div className="site-footer__legal">
        <span>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</span>
        <span>Website strategy and development by Designed to Breakthrough LLC.</span>
      </div>
    </footer>
  );
}
