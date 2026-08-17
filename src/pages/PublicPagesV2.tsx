import type { ReactNode } from 'react';

type HeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  media?: ReactNode;
};

function CompactHero({ eyebrow, title, description, primary, secondary, media }: HeroProps) {
  return (
    <section className={`compact-hero${media ? ' compact-hero--media' : ''}`}>
      <div className="compact-hero__copy">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="compact-hero__actions">
          <a className="button" href={primary.href}>{primary.label}</a>
          {secondary && <a className="text-link" href={secondary.href}>{secondary.label} →</a>}
        </div>
      </div>
      {media && <div className="compact-hero__media">{media}</div>}
    </section>
  );
}

function ActionBand({ title, copy, primary, secondary }: { title: string; copy: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  return (
    <section className="action-band">
      <div><h2>{title}</h2><p>{copy}</p></div>
      <div><a className="button" href={primary.href}>{primary.label}</a>{secondary && <a className="text-link" href={secondary.href}>{secondary.label} →</a>}</div>
    </section>
  );
}

export function EmbroideryPageV2() {
  return (
    <>
      <CompactHero
        eyebrow="Embroidery"
        title="Stitched logos and lettering for pieces that get worn often."
        description="A strong fit for polos, hats, jackets, workwear, uniforms, bags, and other items where a compact design needs a durable finish."
        primary={{ label: 'Design an embroidered piece', href: '/studio?garment=polo' }}
        secondary={{ label: 'Start a request', href: '/start-order?type=custom' }}
        media={<img src="/store/polo.svg" alt="Polo prepared for embroidery" />}
      />

      <section className="fit-comparison">
        <div className="fit-comparison__yes"><span>Usually works well</span><h2>Simple marks on structured apparel.</h2><ul><li>Logos and short text</li><li>Polos and workwear</li><li>Caps and outerwear</li><li>Chest, sleeve, and hat placements</li></ul></div>
        <div><span>Usually better as print</span><h2>Large or highly detailed artwork.</h2><ul><li>Photos and gradients</li><li>Very fine detail</li><li>Oversized front or back art</li><li>Artwork built around many colors</li></ul></div>
      </section>

      <section className="placement-visual">
        <div><span className="eyebrow">Common placements</span><h2>Placement depends on the garment.</h2><p>Seams, pockets, panels, and artwork size all affect where embroidery can sit cleanly.</p></div>
        <div className="placement-chips"><span>Left chest</span><span>Right chest</span><span>Hat front</span><span>Hat side</span><span>Sleeve</span><span>Upper back</span><span>Bag / accessory</span></div>
      </section>

      <ActionBand title="Want to mock it up first?" copy="Choose a garment and placement in Studio, then send it for production review." primary={{ label: 'Open Studio', href: '/studio?garment=polo' }} secondary={{ label: 'Start a request', href: '/start-order' }} />
    </>
  );
}

export function GraphicApparelPageV2() {
  return (
    <>
      <CompactHero
        eyebrow="Graphic apparel"
        title="For tees, hoodies, and designs that need more space."
        description="Use graphic decoration when color, larger artwork, names, numbers, or detailed designs matter more than a stitched finish."
        primary={{ label: 'Design a graphic piece', href: '/studio?garment=tee' }}
        secondary={{ label: 'Start a request', href: '/start-order?type=custom' }}
        media={<img src="/store/tee.svg" alt="Graphic tee development visual" />}
      />

      <section className="method-use-grid">
        <article><span>Artwork</span><h2>Detailed and colorful designs</h2><p>Good for illustrations, creator graphics, event artwork, and other designs with more visual detail.</p></article>
        <article><span>Runs</span><h2>Repeated team or group graphics</h2><p>Quantity, garment, colors, and artwork determine the best production method.</p></article>
        <article><span>Personalization</span><h2>Names and numbers</h2><p>Player numbers, names, sleeves, and other variable details can be planned with the order.</p></article>
      </section>

      <section className="artwork-readiness">
        <div><span className="eyebrow">Artwork</span><h2>Send the best file you have.</h2><p>Vector or high-resolution transparent artwork is ideal. A sketch, screenshot, or unfinished concept can still start the conversation.</p></div>
        <div><b>Helpful files</b><span>SVG / AI / EPS</span><span>High-resolution PNG</span><span>Original editable artwork</span><span>Brand colors, if known</span></div>
      </section>

      <ActionBand title="Ready to place the artwork?" copy="Build a mockup in Studio or send the design with your project details." primary={{ label: 'Open Studio', href: '/studio?garment=tee' }} secondary={{ label: 'Start a request', href: '/start-order' }} />
    </>
  );
}

export function CreatorMerchPageV2() {
  return (
    <>
      <CompactHero
        eyebrow="Creator merch"
        title="Merch built around the creator and the audience."
        description="Start with a focused drop, learn what sells, then restock or grow into a larger collection when the demand is there."
        primary={{ label: 'Plan a merch drop', href: '/start-order?type=creator' }}
        secondary={{ label: 'Design a first piece', href: '/studio?garment=hoodie' }}
        media={<img src="/store/hoodie.svg" alt="Creator hoodie development visual" />}
      />

      <section className="creator-paths">
        <article><span>01</span><h2>First drop</h2><p>Start with one or two strong pieces and approve the real samples before launch.</p></article>
        <article><span>02</span><h2>Restock</h2><p>Reuse the approved design and order setup instead of rebuilding the project from scratch.</p></article>
        <article><span>03</span><h2>Storefront</h2><p>When a collection is ready for ongoing sales, give it a focused place to live.</p></article>
      </section>

      <section className="creator-flow" aria-label="Creator merchandise process"><span>Concept</span><b>→</b><span>Sample</span><b>→</b><span>Approve</span><b>→</b><span>Launch</span><b>→</b><span>Restock</span></section>

      <ActionBand title="Have a merch idea?" copy="Share the creator, the concept, the products you are considering, and the target launch." primary={{ label: 'Plan the drop', href: '/start-order?type=creator' }} />
    </>
  );
}

export function PortfolioPageV2() {
  return (
    <>
      <CompactHero
        eyebrow="Work"
        title="Real samples and finished work belong here."
        description="BEE is still building its first physical samples. This page stays small until there is real embroidery, print work, and finished apparel worth showing."
        primary={{ label: 'Start a project', href: '/start-order' }}
      />

      <section className="sample-lab-plan">
        <article><span>Sample 01</span><h2>Embroidery detail</h2><p>Stitch quality, edge clarity, backing, and small-detail behavior.</p></article>
        <article><span>Sample 02</span><h2>Graphic finish</h2><p>Color, texture, detail, stretch, and how the print sits on the garment.</p></article>
        <article><span>Sample 03</span><h2>Finished piece</h2><p>Placement, scale, fit, and real-world photography.</p></article>
      </section>

      <ActionBand title="Want your project reviewed?" copy="Finished customer work is only published with approval." primary={{ label: 'Start a project', href: '/start-order' }} />
    </>
  );
}

export function AboutPageV2() {
  return (
    <>
      <CompactHero
        eyebrow="About BEE"
        title="A new custom apparel shop building the process alongside the equipment."
        description="BEE Organization is setting up embroidery and graphic apparel production with quoting, proofing, order records, and reorders built into the workflow from the start."
        primary={{ label: 'Start a project', href: '/start-order' }}
        secondary={{ label: 'See apparel options', href: '/#capabilities' }}
      />

      <section className="about-principles">
        <article><span>01</span><h2>Confirm it before making it</h2><p>Garment, artwork, placement, quantity, timing, and pricing are reviewed before production.</p></article>
        <article><span>02</span><h2>Use the right decoration</h2><p>Embroidery or graphic decoration is chosen around the garment and the design.</p></article>
        <article><span>03</span><h2>Make reorders easier</h2><p>Approved artwork and project details stay useful instead of disappearing into old messages.</p></article>
      </section>

      <section className="about-stage">
        <div><span className="eyebrow">Current stage</span><h2>BEE is preparing for its first official sale.</h2></div>
        <p>Equipment, production methods, samples, and the customer workflow are still being built and tested. The site does not invent customer history or production claims to make the business look older than it is.</p>
      </section>

      <ActionBand title="Have something you want made?" copy="Start with the project details you already know." primary={{ label: 'Start a project', href: '/start-order' }} secondary={{ label: 'Design in Studio', href: '/studio' }} />
    </>
  );
}
