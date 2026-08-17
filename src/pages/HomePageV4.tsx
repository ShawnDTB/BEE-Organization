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
          <span className="eyebrow">Embroidery · graphic apparel · group orders</span>
          <h1>{siteConfig.primaryMessage}</h1>
          <p>{siteConfig.supportingMessage}</p>
          <div className="home-hero-v3__actions">
            <a className="button" href="/studio">Design a piece</a>
            <a href="/bulk-orders">Start a group order</a>
            <a href="/shop">Shop finished merch</a>
          </div>
        </div>

        <div className="home-hero-v3__visual" aria-label="Custom apparel examples">
          <div className="home-garment home-garment--primary"><img src="/store/hoodie.svg" alt="Heavyweight hoodie development visual" /></div>
          <div className="home-garment home-garment--secondary"><img src="/store/polo.svg" alt="Performance polo development visual" /></div>
          <div className="home-hero-v3__note"><span>Quote</span><b>→</b><span>Proof</span><b>→</b><span>Production</span><b>→</b><span>Reorder</span></div>
        </div>
      </section>

      <section className="capability-mosaic capability-mosaic--home" id="capabilities" aria-label="Custom apparel options">
        <a href="/embroidery" className="capability-tile capability-tile--wide">
          <div><span>Embroidery</span><h2>Polos, hats, jackets, uniforms, and other stitched pieces.</h2><b>See embroidery →</b></div>
          <img src="/store/polo.svg" alt="Embroidered polo development visual" />
        </a>
        <a href="/graphic-apparel" className="capability-tile">
          <div><span>Graphic apparel</span><h2>Tees, hoodies, and artwork-led pieces.</h2><b>See graphic apparel →</b></div>
          <img src="/store/tee.svg" alt="Graphic tee development visual" />
        </a>
        <a href="/bulk-orders" className="capability-tile">
          <div><span>Groups & teams</span><h2>Sizes, approvals, and reorders in one project.</h2><b>See group ordering →</b></div>
          <img src="/store/layer.svg" alt="Organization outerwear development visual" />
        </a>
      </section>

      <section className="home-process">
        <div>
          <span className="eyebrow">What happens next</span>
          <h2>Four checkpoints before the order is finished.</h2>
        </div>
        <ProcessRail />
      </section>

      <section className="action-band">
        <div><h2>Have a project in mind?</h2><p>Build the mockup yourself or send the details you already have.</p></div>
        <div><a className="button" href="/studio">Open Studio</a><a className="text-link" href="/start-order">Start a request →</a></div>
      </section>
    </>
  );
}
