import { LogoLockup } from "./LogoLockup";
import { siteConfig } from "../content/siteContent";
export function SiteFooter() {
  return (
    <footer className="sf-footer">
      <div className="sf-wrap sf-footer-top">
        <div>
          <LogoLockup />
          <p>Build. Empower. Equip.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          <a href="/start-order">Plan a custom order</a>
          <a href="/privacy">Privacy</a>
        </nav>
        <details>
          <summary>Project tools</summary>
          <nav aria-label="Project tools">
            <a href="/studio">Design studio</a>
            <a href="/group-planner">Group size planner</a>
            <a href="/account">Saved projects</a>
            <a href="/cart">Project bag</a>
            <a href="/about">About BEE</a>
          </nav>
        </details>
      </div>
      {(siteConfig.email || siteConfig.phone) && (
        <div className="sf-wrap sf-footer-contact">
          {siteConfig.email && (
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          )}
          {siteConfig.phone && (
            <a href={`tel:${siteConfig.phone.replace(/[^+0-9]/g, "")}`}>
              {siteConfig.phone}
            </a>
          )}
        </div>
      )}
      <div className="sf-wrap sf-footer-bottom">
        <span>
          © {new Date().getFullYear()} {siteConfig.legalName}
        </span>
        <span>Digital foundation by Designed to Breakthrough</span>
      </div>
    </footer>
  );
}
