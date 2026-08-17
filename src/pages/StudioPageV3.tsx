import { StudioPage } from './StudioPageV2';

export function StudioPageV3() {
  return (
    <div className="studio-v3-shell">
      <header className="studio-v3-intro">
        <div>
          <span className="eyebrow">BEE Studio</span>
          <h1>Build your apparel mockup.</h1>
        </div>
        <p>Choose a garment, add text or artwork, pick embroidery or print, and set the placement. Add it to your project bag when the mockup is ready for review.</p>
      </header>

      <StudioPage />

      <footer className="studio-v3-note">
        <div><strong>Mockup only.</strong><span>Garment shape, color, and placement are approximate until real supplier assets are connected.</span></div>
        <div><strong>Final proof required.</strong><span>Artwork, decoration method, availability, pricing, and placement are confirmed before production.</span></div>
      </footer>
    </div>
  );
}
