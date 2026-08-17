import { LogoLockup } from './LogoLockup';
import { siteConfig } from '../content/siteContent';

export function SiteFooter() {
  return (
    <footer className="site-footer site-footer--v3">
      <div className="site-footer__lead">
        <div><LogoLockup compact /><p>{siteConfig.primaryMessage}</p></div>
        <div className="site-footer__lead-actions"><a className="button" href="/studio">Design custom apparel</a><a className="text-link" href="/start-order">Start a project →</a></div>
      </div>

      <div className="site-footer__grid site-footer__grid--v3">
        <div><h2>Start</h2><a href="/studio">BEE Studio</a><a href="/bulk-orders">Bulk & organizations</a><a href="/creator-merch">Creator merch</a><a href="/shop">Shop collections</a></div>
        <div><h2>Capabilities</h2><a href="/embroidery">Embroidery</a><a href="/graphic-apparel">Graphic apparel</a><a href="/our-work">Sample Lab / Work</a></div>
        <div><h2>Your project</h2><a href="/cart">Project bag</a><a href="/project-review">Project review</a><a href="/account">Customer workspace</a><a href="/about">About BEE</a></div>
      </div>

      <div className="site-footer__legal"><span>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</span><span>{siteConfig.serviceArea}</span></div>
    </footer>
  );
}
