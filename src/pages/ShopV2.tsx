import { useState } from 'react';

type FeatureLane = 'creator' | 'bee' | 'organization';

const features = {
  creator: {
    tab: 'Featured creator',
    eyebrow: 'Creator collection',
    title: 'The creator should own the moment.',
    copy: 'Approved creator drops will lead with campaign media, the story behind the release, and products customers can actually buy.',
    action: 'Plan a creator drop',
    href: '/creator-merch',
    image: '/store/hoodie.svg',
  },
  bee: {
    tab: 'BEE originals',
    eyebrow: 'BEE collection',
    title: 'BEE-owned samples can become the first honest products in the shop.',
    copy: 'A BEE original appears here only after the piece exists, has been photographed, priced, and approved for sale.',
    action: 'See the Sample Lab',
    href: '/our-work',
    image: '/store/tee.svg',
  },
  organization: {
    tab: 'Organization stores',
    eyebrow: 'Group storefronts',
    title: 'Approved programs can stay easy to find and easy to reorder.',
    copy: 'Future organization stores can give teams, schools, businesses, and communities a focused place to order approved pieces.',
    action: 'Plan a group program',
    href: '/bulk-orders',
    image: '/store/polo.svg',
  },
} as const;

export function ShopV2Page() {
  const [active, setActive] = useState<FeatureLane>('creator');
  const feature = features[active];

  return (
    <section className="shop-v3">
      <div className="shop-v3__tabs" role="tablist" aria-label="Storefront lanes">
        {(Object.keys(features) as FeatureLane[]).map((key) => (
          <button key={key} type="button" className={active === key ? 'is-active' : undefined} role="tab" aria-selected={active === key} onClick={() => setActive(key)}>
            {features[key].tab}
          </button>
        ))}
      </div>

      <section className="shop-v3__feature">
        <div className="shop-v3__copy">
          <span className="eyebrow">{feature.eyebrow}</span>
          <h1>{feature.title}</h1>
          <p>{feature.copy}</p>
          <a className="button" href={feature.href}>{feature.action}</a>
        </div>
        <div className="shop-v3__media">
          <img src={feature.image} alt="" />
          <div><span>Campaign media</span><b>Reserved for real finished merchandise</b></div>
        </div>
      </section>

      <section className="shop-v3__catalog">
        <header><div><span className="eyebrow">Shop</span><h2>No public products yet.</h2></div><p>BEE is still pre-sale. The product grid activates when a real BEE piece, creator drop, or organization collection is ready to purchase.</p></header>
        <div className="shop-v3__empty">
          <div className="shop-v3__empty-grid" aria-hidden="true"><i /><i /><i /><i /></div>
          <div><strong>Finished merchandise only</strong><p>Blank garment bases, quote-only products, and development mockups no longer live in Shop. Custom work starts in BEE Studio.</p><a className="text-link" href="/studio">Design something custom →</a></div>
        </div>
      </section>

      <section className="shop-v3__studio">
        <div><span className="eyebrow">Need something made for you?</span><h2>Shop is for finished merchandise. Studio is for your idea.</h2><p>Choose a garment, build the design, and move the concept into a custom project review.</p></div>
        <div className="shop-v3__studio-options">
          <a href="/studio?garment=tee"><img src="/store/tee.svg" alt="" /><span>Tee</span></a>
          <a href="/studio?garment=hoodie"><img src="/store/hoodie.svg" alt="" /><span>Hoodie</span></a>
          <a href="/studio?garment=polo"><img src="/store/polo.svg" alt="" /><span>Polo</span></a>
        </div>
      </section>
    </section>
  );
}
