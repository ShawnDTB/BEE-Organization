import { LogoLockup } from "./LogoLockup";
import { siteConfig } from "../content/siteContent";
export function SiteFooter() {
  return (
    <footer className="bee-footer">
      <div className="bee-page">
        <div className="bee-footer-top">
          <div>
            <LogoLockup />
            <p>Build. Empower. Equip.</p>
            <span>Custom apparel with your people in mind.</span>
          </div>
          <a className="button" href="/start-order">
            Start a project ↗
          </a>
        </div>
        <div className="bee-footer-links">
          <div>
            <strong>The work</strong>
            <a href="/custom-apparel">Custom apparel</a>
            <a href="/bulk-orders">Groups & businesses</a>
            <a href="/creator-merch">Creator merchandise</a>
            <a href="/our-work">Samples & work</a>
          </div>
          <div>
            <strong>Your next project</strong>
            <a href="/studio">Design studio</a>
            <a href="/group-planner">Group size planner</a>
            <a href="/cart">Project bag</a>
            <a href="/account">My projects</a>
            <a href="/start-order">Request a quote</a>
          </div>
          <div>
            <strong>Works by BEE</strong>
            <a href="/about">About the business</a>
            <a href="/privacy">Project privacy</a>
            <a href="/shop">Future collections</a>
            {siteConfig.email && (
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            )}
            {siteConfig.phone && (
              <a href={`tel:${siteConfig.phone.replace(/[^+0-9]/g, "")}`}>
                {siteConfig.phone}
              </a>
            )}
          </div>
        </div>
        <div className="bee-footer-bottom">
          <span>
            © {new Date().getFullYear()} {siteConfig.legalName}
          </span>
          <span>Digital foundation by Designed to Breakthrough</span>
        </div>
      </div>
    </footer>
  );
}
