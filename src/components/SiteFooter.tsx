import { LogoLockup } from './LogoLockup';
import { navItems, siteConfig } from '../content/siteContent';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__lead">
        <LogoLockup compact />
        <p>{siteConfig.primaryMessage}</p>
        <div className="site-footer__lead-actions">
          <a className="text-link" href="/shop">Shop collections</a>
          <a className="button" href="/studio">Open BEE Studio</a>
        </div>
      </div>
      <div className="site-footer__grid">
        <div>
          <h2>Make something</h2>
          <a href="/studio">BEE Studio</a>
          <a href="/bulk-orders">Bulk orders</a>
          <a href="/embroidery">Embroidery</a>
          <a href="/graphic-apparel">Graphic apparel</a>
          <a href="/creator-merch">Creator merchandise</a>
        </div>
        <div>
          <h2>Shop & account</h2>
          <a href="/shop">Published collections</a>
          <a href="/cart">Project bag</a>
          <a href="/account">Customer dashboard</a>
          <a href="/start-order">Start a custom request</a>
        </div>
        <div>
          <h2>Company</h2>
          {navItems.slice(4).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </div>
        <div>
          <h2>Built for</h2>
          <span>Schools, teams, and organizations</span>
          <span>Businesses and staff programs</span>
          <span>Creators and online communities</span>
          <span>Individuals and custom projects</span>
        </div>
      </div>
      <div className="site-footer__legal">
        <span>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</span>
        <span>Website strategy and development by Designed to Breakthrough LLC.</span>
      </div>
    </footer>
  );
}
