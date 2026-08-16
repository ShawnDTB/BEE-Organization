import { useState } from 'react';

type FeatureLane = 'creator' | 'bee' | 'organization';

type Feature = {
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  garment: 'tee' | 'hoodie' | 'polo';
};

const features: Record<FeatureLane, Feature> = {
  creator: {
    label: 'Featured creator',
    eyebrow: 'Creator spotlight',
    title: 'Creator collections should feel like a drop — not a custom-order form.',
    description: 'Approved creator merchandise will lead the storefront here with campaign artwork, a focused collection, and direct paths to buy or build the next release.',
    primaryLabel: 'Creator merch program',
    primaryHref: '/creator-merch',
    secondaryLabel: 'Build a creator piece',
    secondaryHref: '/studio?garment=hoodie',
    garment: 'hoodie',
  },
  bee: {
    label: 'BEE originals',
    eyebrow: 'BEE development',
    title: 'BEE-branded work can become the first honest storefront collection.',
    description: 'Production samples and internal BEE pieces can be published here once they physically exist, are photographed, and are approved for sale. They will never be presented as client work.',
    primaryLabel: 'Open BEE Studio',
    primaryHref: '/studio',
    secondaryLabel: 'See completed work',
    secondaryHref: '/our-work',
    garment: 'tee',
  },
  organization: {
    label: 'Organization stores',
    eyebrow: 'Recurring programs',
    title: 'A finished organization program can become its own repeatable storefront.',
    description: 'Schools, teams, businesses, and communities can eventually receive focused collection pages built around approved garments, artwork, sizing, and reorder rules.',
    primaryLabel: 'Bulk & organizations',
    primaryHref: '/bulk-orders',
    secondaryLabel: 'Start a program',
    secondaryHref: '/start-order',
    garment: 'polo',
  },
};

function GarmentEditorial({ garment }: { garment: Feature['garment'] }) {
  const src = garment === 'hoodie' ? '/store/hoodie.svg' : garment === 'polo' ? '/store/polo.svg' : '/store/tee.svg';
  return (
    <div className="shop-feature-visual" aria-hidden="true">
      <div className="shop-feature-visual__meta"><span>Collection media</span><span>Pre-launch structure</span></div>
      <img src={src} alt="" />
      <div className="shop-feature-visual__footer"><span>Real campaign photography replaces this development visual.</span></div>
    </div>
  );
}

export function ShopV2Page() {
  const [active, setActive] = useState<FeatureLane>('creator');
  const feature = features[active];

  return (
    <>
      <section className="shop-v2-hero">
        <div className="shop-feature-tabs" role="tablist" aria-label="Featured storefront lanes">
          {(Object.keys(features) as FeatureLane[]).map((key) => (
            <button
              key={key}
              type="button"
              className={active === key ? 'is-active' : undefined}
              onClick={() => setActive(key)}
              role="tab"
              aria-selected={active === key}
            >
              {features[key].label}
            </button>
          ))}
        </div>
        <div className="shop-feature-banner">
          <div className="shop-feature-copy">
            <span className="eyebrow">{feature.eyebrow}</span>
            <h1>{feature.title}</h1>
            <p>{feature.description}</p>
            <div className="shop-feature-actions">
              <a className="button" href={feature.primaryHref}>{feature.primaryLabel}</a>
              <a className="text-link" href={feature.secondaryHref}>{feature.secondaryLabel} →</a>
            </div>
          </div>
          <GarmentEditorial garment={feature.garment} />
        </div>
      </section>

      <section className="shop-v2-status">
        <div>
          <span className="eyebrow">Published merchandise</span>
          <h2>The shop only shows work that actually exists.</h2>
        </div>
        <p>BEE is still pre-sale. There are currently no public customer collections or finished merchandise drops to publish. This state disappears as legitimate BEE, creator, and organization merchandise is completed and approved.</p>
      </section>

      <section className="shop-empty-collection">
        <div className="shop-empty-collection__visual" aria-hidden="true">
          <span>01</span><span>02</span><span>03</span><span>04</span>
        </div>
        <div>
          <span className="eyebrow">First collection pending</span>
          <h2>Real products will replace placeholders — not sit beside them.</h2>
          <p>The eventual catalog card will represent a real finished product with approved photography, product details, availability, pricing behavior, and the collection or customer it belongs to.</p>
          <div className="shop-empty-actions">
            <a className="button" href="/studio">Design the first piece</a>
            <a className="text-link" href="/our-work">View project portfolio →</a>
          </div>
        </div>
      </section>

      <section className="studio-entry-band">
        <div>
          <span className="eyebrow">Need something custom?</span>
          <h2>The garment catalog moved to BEE Studio.</h2>
          <p>Choose the garment, change its color, add text or artwork, set a decoration path, position the design, and save the concept into your project bag.</p>
        </div>
        <div className="studio-entry-options">
          <a href="/studio?garment=tee"><img src="/store/tee.svg" alt="T-shirt" /><span>Start with a tee</span></a>
          <a href="/studio?garment=hoodie"><img src="/store/hoodie.svg" alt="Hoodie" /><span>Start with a hoodie</span></a>
          <a href="/studio?garment=polo"><img src="/store/polo.svg" alt="Polo" /><span>Start with a polo</span></a>
        </div>
      </section>
    </>
  );
}
