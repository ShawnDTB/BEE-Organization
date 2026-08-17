import { orderSteps, siteConfig } from '../content/siteContent';

function ProcessRail() {
  return (
    <ol className="process-rail">
      {orderSteps.map(([number, title, description]) => (
        <li key={number}>
          <span>{number}</span>
          <div><strong>{title}</strong><p>{description}</p></div>
        </li>
      ))}
    </ol>
  );
}

export function HomePageV4() {
  return (
    <>
      <section className="home-hero-v3">
        <div className="home-hero-v3__copy">
          <span className="eyebrow">Custom apparel · built clearly</span>
          <h1>{siteConfig.primaryMessage}</h1>
          <p>{siteConfig.supportingMessage}</p>
          <div className="home-hero-v3__actions">
            <a className="button" href="/studio">Design custom apparel</a>
            <a href="/bulk-orders">Bulk & team orders</a>
            <a href="/shop">Shop collections</a>
          </div>
        </div>

        <div className="home-hero-v3__visual" aria-label="Custom apparel examples">
          <div className="home-garment home-garment--primary"><img src="/store/hoodie.svg" alt="Heavyweight hoodie development visual" /></div>
          <div className="home-garment home-garment--secondary"><img src="/store/polo.svg" alt="Performance polo development visual" /></div>
          <div className="home-hero-v3__note"><span>Design</span><b>→</b><span>Approve</span><b>→</b><span>Produce</span><b>→</b><span>Reorder</span></div>
        </div>
      </section>

      <section className="capability-mosaic capability-mosaic--home">
        <a href="/embroidery" className="capability-tile capability-tile--wide">
          <div><span>Embroidery</span><h2>Stitched branding for polos, hats, outerwear, uniforms, and more.</h2><b>Explore embroidery →</b></div>
          <img src="/store/polo.svg" alt="Embroidered polo development visual" />
        </a>
        <a href="/graphic-apparel" className="capability-tile">
          <div><span>Graphic apparel</span><h2>Artwork that needs color and room.</h2><b>Explore graphics →</b></div>
          <img src="/store/tee.svg" alt="Graphic tee development visual" />
        </a>
        <a href="/bulk-orders" className="capability-tile">
          <div><span>Groups & teams</span><h2>One organized order for everyone.</h2><b>Plan a group order →</b></div>
          <img src="/store/layer.svg" alt="Organization outerwear development visual" />
        </a>
      </section>

      <section className="home-process">
        <div>
          <span className="eyebrow">How custom work moves</span>
          <h2>Know what happens before anything gets made.</h2>
        </div>
        <ProcessRail />
      </section>

      <section className="action-band">
        <div><h2>Ready to make something?</h2><p>Start with the garment or send the project details you already have.</p></div>
        <div><a className="button" href="/studio">Open Studio</a><a className="text-link" href="/start-order">Start a request →</a></div>
      </section>
    </>
  );
}
