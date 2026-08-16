import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  dashboardPreviewProjects,
  dashboardPreviewReorders,
  findStoreProduct,
  storeCategories,
  storeProducts,
  type StoreCategory,
  type StoreProduct,
} from '../content/storeContent';

const CART_KEY = 'bee-project-bag-v1';
const CART_EVENT = 'bee-cart-updated';

export type ProjectBagItem = {
  id: string;
  productSlug: string;
  color: string;
  size: string;
  quantity: number;
  decoration: string;
};

function safeReadBag(): ProjectBagItem[] {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBag(items: ProjectBagItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

function productPath(product: StoreProduct) {
  return `/shop/${product.slug}`;
}

function CommerceNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="commerce-notice">
      <strong>Pre-launch commerce preview</strong>
      <span>{children}</span>
    </div>
  );
}

function ProductMedia({ product, compact = false }: { product: StoreProduct; compact?: boolean }) {
  return (
    <div className={`product-media${compact ? ' product-media--compact' : ''}`}>
      <span>{product.badge}</span>
      <div className="product-media__shape" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <small>{product.mediaLabel}</small>
    </div>
  );
}

function ProductCard({ product }: { product: StoreProduct }) {
  return (
    <a className="product-card" href={productPath(product)}>
      <ProductMedia product={product} compact />
      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.category}</span>
          <b>Custom quote</b>
        </div>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <div className="product-card__footer">
          <small>{product.decoration}</small>
          <strong>Configure →</strong>
        </div>
      </div>
    </a>
  );
}

export function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof storeCategories)[number]>('All');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return storeProducts;
    return storeProducts.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <section className="commerce-hero">
        <div>
          <span className="eyebrow">Shop the starting point</span>
          <h1>Choose the garment. Build the project around it.</h1>
          <p>
            BEE's storefront is designed for custom commerce: browse practical starting products, configure the details you know, and move the project into quote and proof review without pretending every custom order has one universal price.
          </p>
          <div className="commerce-hero__actions">
            <a className="button" href="#catalog">Browse catalog</a>
            <a className="text-link" href="/account">Customer dashboard →</a>
          </div>
        </div>
        <div className="commerce-hero__panel">
          <span>Shopping flow</span>
          <ol>
            <li><b>01</b><strong>Choose a starting product</strong><small>Garment type and intended use</small></li>
            <li><b>02</b><strong>Configure the basics</strong><small>Color, size, quantity, decoration</small></li>
            <li><b>03</b><strong>Add it to your project bag</strong><small>Combine multiple pieces in one request</small></li>
            <li><b>04</b><strong>Request review</strong><small>Pricing, artwork, availability, and proof follow</small></li>
          </ol>
        </div>
      </section>

      <section className="section commerce-intro">
        <CommerceNotice>
          Product photography, supplier-linked inventory, live pricing, payment processing, and real customer orders are not active yet. These catalog entries are structured product pathways, not claims of current stock.
        </CommerceNotice>
      </section>

      <section id="catalog" className="section shop-catalog">
        <div className="shop-toolbar">
          <div>
            <span className="eyebrow">Catalog</span>
            <h2>Start with what you want to wear.</h2>
          </div>
          <div className="shop-filters" aria-label="Filter catalog">
            {storeCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? 'is-active' : undefined}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="product-grid">
          {filteredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </section>

      <section className="section section--contrast commerce-principles">
        <div className="section-heading">
          <div><span className="eyebrow">Why this model</span><h2>A storefront that still respects custom production.</h2></div>
          <p>The experience should feel easy to shop without hiding the variables that actually determine a custom order.</p>
        </div>
        <div className="commerce-principle-grid">
          <article><span>01</span><h3>No fake universal price</h3><p>Garment, quantity, decoration, artwork, personalization, supplier conditions, and fulfillment can change the final quote.</p></article>
          <article><span>02</span><h3>One project bag</h3><p>A customer can collect multiple garment ideas before moving into review instead of opening separate disconnected requests.</p></article>
          <article><span>03</span><h3>Built for reorders</h3><p>Once real accounts are connected, approved configurations can become repeatable starting points rather than one-time checkout records.</p></article>
        </div>
      </section>
    </>
  );
}

export function ShopProductPage() {
  const slug = decodeURIComponent(window.location.pathname.split('/').filter(Boolean)[1] ?? '');
  const product = findStoreProduct(slug);

  const [color, setColor] = useState(product?.colors[0] ?? '');
  const [size, setSize] = useState(product?.sizes[0] ?? '');
  const [quantity, setQuantity] = useState(12);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <section className="commerce-empty-page">
        <span className="eyebrow">Product not found</span>
        <h1>That product is not in the current catalog.</h1>
        <p>The catalog is still being developed as production capabilities and supplier choices are confirmed.</p>
        <a className="button" href="/shop">Return to shop</a>
      </section>
    );
  }

  function addToBag() {
    const current = safeReadBag();
    const item: ProjectBagItem = {
      id: `${product.slug}-${Date.now()}`,
      productSlug: product.slug,
      color,
      size,
      quantity: Math.max(1, quantity),
      decoration: product.decoration,
    };
    saveBag([...current, item]);
    setAdded(true);
  }

  const related = storeProducts.filter((item) => item.slug !== product.slug && item.category === product.category).slice(0, 3);

  return (
    <>
      <section className="product-detail">
        <div className="product-detail__media">
          <ProductMedia product={product} />
          <div className="product-detail__thumbs" aria-label="Planned product media views">
            <span>Front</span><span>Detail</span><span>Placement</span>
          </div>
        </div>
        <div className="product-detail__copy">
          <a className="commerce-breadcrumb" href="/shop">Shop / {product.category}</a>
          <span className="product-detail__badge">{product.badge}</span>
          <h1>{product.name}</h1>
          <p className="product-detail__description">{product.description}</p>
          <div className="product-detail__pricing">
            <strong>Custom quote</strong>
            <span>Final pricing follows garment, quantity, artwork, decoration, supplier availability, and fulfillment review.</span>
          </div>

          <div className="product-configurator">
            <div>
              <label htmlFor="product-color">Garment color</label>
              <select id="product-color" value={color} onChange={(event) => setColor(event.target.value)}>
                {product.colors.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="product-size">Starting size</label>
              <select id="product-size" value={size} onChange={(event) => setSize(event.target.value)}>
                {product.sizes.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="product-quantity">Estimated quantity</label>
              <input id="product-quantity" type="number" min="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
            </div>
            <div>
              <span className="config-label">Decoration path</span>
              <strong className="config-value">{product.decoration}</strong>
            </div>
          </div>

          <button className="button product-detail__add" type="button" onClick={addToBag}>Add to project bag</button>
          {added && <div className="add-confirmation" role="status"><span>Added to your project bag.</span><a href="/cart">Review bag →</a></div>}

          <dl className="product-detail__facts">
            <div><dt>Best for</dt><dd>{product.bestFor}</dd></div>
            <div><dt>Quantity approach</dt><dd>{product.quantityGuidance}</dd></div>
            <div><dt>Available sizes in this preview</dt><dd>{product.sizes.join(', ')}</dd></div>
          </dl>
        </div>
      </section>

      <section className="section product-detail__process">
        <div className="section-heading">
          <div><span className="eyebrow">After adding it</span><h2>The bag starts the project. It does not skip review.</h2></div>
          <p>Artwork, exact garment model, all sizes, decoration placement, quantity, and target date are confirmed before production.</p>
        </div>
        <div className="commerce-principle-grid">
          <article><span>01</span><h3>Build the bag</h3><p>Add the garment paths you are considering, including different pieces for the same project.</p></article>
          <article><span>02</span><h3>Request review</h3><p>Confirm contact, organization, artwork status, target date, and fulfillment needs.</p></article>
          <article><span>03</span><h3>Approve before production</h3><p>Pricing and proofs remain explicit checkpoints instead of being hidden inside a one-click checkout.</p></article>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--contrast related-products">
          <div className="section-heading"><div><span className="eyebrow">Related</span><h2>More from {product.category}.</h2></div></div>
          <div className="product-grid product-grid--related">{related.map((item) => <ProductCard key={item.slug} product={item} />)}</div>
        </section>
      )}
    </>
  );
}

export function CartPage() {
  const [items, setItems] = useState<ProjectBagItem[]>(() => safeReadBag());

  useEffect(() => {
    const sync = () => setItems(safeReadBag());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  function updateQuantity(id: string, quantity: number) {
    const next = items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item);
    setItems(next);
    saveBag(next);
  }

  function removeItem(id: string) {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    saveBag(next);
  }

  const totalPieces = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="cart-page">
      <div className="cart-page__heading">
        <div><span className="eyebrow">Project bag</span><h1>Build the order before the quote.</h1></div>
        <p>{items.length === 0 ? 'Your project bag is empty.' : `${items.length} configured item${items.length === 1 ? '' : 's'} · ${totalPieces} estimated piece${totalPieces === 1 ? '' : 's'}`}</p>
      </div>

      {items.length === 0 ? (
        <div className="bag-empty">
          <span>Nothing configured yet</span>
          <h2>Start in the catalog and add the pieces you want reviewed together.</h2>
          <p>The project bag is stored in this browser during the frontend preview.</p>
          <a className="button" href="/shop">Browse the shop</a>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => {
              const product = findStoreProduct(item.productSlug);
              if (!product) return null;
              return (
                <article className="cart-item" key={item.id}>
                  <ProductMedia product={product} compact />
                  <div className="cart-item__copy">
                    <span>{product.category}</span>
                    <h2><a href={productPath(product)}>{product.name}</a></h2>
                    <dl>
                      <div><dt>Color</dt><dd>{item.color}</dd></div>
                      <div><dt>Starting size</dt><dd>{item.size}</dd></div>
                      <div><dt>Decoration</dt><dd>{item.decoration}</dd></div>
                    </dl>
                    <div className="cart-item__controls">
                      <label>Quantity<input type="number" min="1" value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} /></label>
                      <button type="button" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="bag-summary">
            <span className="eyebrow">Review summary</span>
            <div><small>Configured products</small><strong>{items.length}</strong></div>
            <div><small>Estimated pieces</small><strong>{totalPieces}</strong></div>
            <div><small>Pricing</small><strong>Prepared after review</strong></div>
            <p>No payment is collected from this preview. Checkout collects the project context needed to prepare a real quote workflow later.</p>
            <a className="button" href="/checkout">Continue to review</a>
            <a className="text-link" href="/shop">Keep shopping →</a>
          </aside>
        </div>
      )}
    </section>
  );
}

export function CheckoutPage() {
  const [items] = useState<ProjectBagItem[]>(() => safeReadBag());
  const [prepared, setPrepared] = useState(false);
  const totalPieces = items.reduce((sum, item) => sum + item.quantity, 0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) return;
    setPrepared(true);
  }

  if (items.length === 0) {
    return (
      <section className="commerce-empty-page">
        <span className="eyebrow">Checkout preview</span>
        <h1>Your project bag needs at least one item.</h1>
        <p>Add a garment configuration before entering the project review flow.</p>
        <a className="button" href="/shop">Browse the shop</a>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout-page__heading">
        <span className="eyebrow">Project review</span>
        <h1>Turn the bag into a complete request.</h1>
        <p>This is the customer-facing bridge between shopping and BEE's quote workflow. It does not transmit data or collect payment yet.</p>
      </div>
      <CommerceNotice>This checkout is a frontend prototype. Submission, secure account storage, artwork uploads, payments, emails, and production records require the backend phase.</CommerceNotice>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Contact</legend>
            <label>Full name<input required autoComplete="name" /></label>
            <label>Email<input required type="email" autoComplete="email" /></label>
            <label>Phone<input type="tel" autoComplete="tel" /></label>
            <label>Organization or brand<input autoComplete="organization" /></label>
          </fieldset>
          <fieldset>
            <legend>Project context</legend>
            <label>Target date<input type="date" /></label>
            <label>Artwork status<select defaultValue=""><option value="">Select one</option><option>Production-ready artwork available</option><option>Artwork exists but needs review</option><option>Concept only</option><option>Design help needed</option></select></label>
            <label>Fulfillment preference<select defaultValue=""><option value="">Not decided</option><option>Pickup</option><option>Bulk delivery</option><option>Shipping</option><option>Individual fulfillment may be needed</option></select></label>
            <label>Order type<select defaultValue=""><option value="">Select one</option><option>Individual custom order</option><option>Business / organization</option><option>School / team</option><option>Creator merchandise</option><option>Event / community</option></select></label>
            <label className="checkout-form__wide">Notes<textarea rows={6} placeholder="Add size breakdowns, placement notes, personalization, event information, or anything else the production team should know." /></label>
          </fieldset>
          <label className="checkout-confirm"><input type="checkbox" required /><span>I understand this preview prepares a request for review and does not place a production order or charge a payment method.</span></label>
          <button className="button" type="submit">Prepare project request</button>
          {prepared && <div className="checkout-prepared" role="status"><strong>Preview prepared.</strong><span>No information was transmitted. The production backend will turn this step into a saved customer request with a reference number, notifications, and account history.</span></div>}
        </form>

        <aside className="checkout-summary">
          <span className="eyebrow">Your bag</span>
          {items.map((item) => {
            const product = findStoreProduct(item.productSlug);
            if (!product) return null;
            return <div className="checkout-summary__item" key={item.id}><strong>{product.name}</strong><span>{item.quantity} × {item.color} · {item.size}</span></div>;
          })}
          <div className="checkout-summary__total"><span>Estimated pieces</span><strong>{totalPieces}</strong></div>
          <div className="checkout-summary__pricing"><span>Price</span><strong>Confirmed after review</strong></div>
          <a className="text-link" href="/cart">Edit project bag →</a>
        </aside>
      </div>
    </section>
  );
}

export function AccountPage() {
  const [bagCount, setBagCount] = useState(() => safeReadBag().length);

  useEffect(() => {
    const sync = () => setBagCount(safeReadBag().length);
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return (
    <>
      <section className="account-hero">
        <div>
          <span className="eyebrow">Customer dashboard</span>
          <h1>Your projects should get easier every time you come back.</h1>
          <p>The account experience is designed around active quotes, proof approvals, production visibility, saved artwork, and repeat orders—not only receipts.</p>
          <div className="account-hero__actions"><a className="button" href="/shop">Start from the shop</a><a className="text-link" href="/start-order">Start a custom request →</a></div>
        </div>
        <div className="account-identity-card">
          <span>Customer account preview</span>
          <strong>Demo workspace</strong>
          <small>Authentication is not connected yet</small>
          <div><b>{bagCount}</b><span>item{bagCount === 1 ? '' : 's'} in your current project bag</span></div>
        </div>
      </section>

      <section className="section account-preview-note">
        <CommerceNotice>All project activity shown below is demonstration content used to design the dashboard. It does not represent real BEE customers, orders, sales, or production history.</CommerceNotice>
      </section>

      <section className="section account-overview">
        <div className="account-section-heading">
          <div><span className="eyebrow">Overview</span><h2>The work that needs attention first.</h2></div>
          <a className="text-link" href="/cart">Project bag ({bagCount}) →</a>
        </div>
        <div className="account-metrics">
          <article><span>Active projects</span><strong>3</strong><small>Sample dashboard data</small></article>
          <article><span>Needs your approval</span><strong>1</strong><small>Sample dashboard data</small></article>
          <article><span>Ready to reorder</span><strong>2</strong><small>Sample dashboard data</small></article>
          <article><span>Saved designs</span><strong>4</strong><small>Sample dashboard data</small></article>
        </div>
      </section>

      <section className="section section--contrast account-workspace">
        <div className="account-workspace__main">
          <div className="account-section-heading"><div><span className="eyebrow">Projects</span><h2>One timeline from quote to delivery.</h2></div></div>
          <div className="project-list">
            {dashboardPreviewProjects.map((project) => (
              <article key={project.title}>
                <div className="project-list__top"><span>{project.label}</span><b>{project.status}</b></div>
                <h3>{project.title}</h3>
                <small>{project.meta}</small>
                <div className="project-progress"><i style={{ width: `${project.progress}%` }} /></div>
                <div className="project-list__next"><span>Next step</span><strong>{project.nextAction}</strong></div>
                <button type="button" disabled>Open sample project</button>
              </article>
            ))}
          </div>
        </div>

        <aside className="account-sidebar">
          <div className="account-sidebar__card">
            <span>Account foundation</span>
            <h3>What the real dashboard will retain</h3>
            <ul>
              <li>Contact and organization profiles</li>
              <li>Approved artwork and production files</li>
              <li>Quotes, proofs, approvals, and messages</li>
              <li>Order status and fulfillment history</li>
              <li>Prior garment configurations</li>
              <li>Reorder starting points</li>
            </ul>
          </div>
          <div className="account-sidebar__card account-sidebar__card--accent">
            <span>Quick actions</span>
            <a href="/shop">Browse products <b>→</b></a>
            <a href="/cart">Review project bag <b>→</b></a>
            <a href="/start-order">Start custom request <b>→</b></a>
          </div>
        </aside>
      </section>

      <section className="section account-reorders">
        <div className="account-section-heading">
          <div><span className="eyebrow">Reorders</span><h2>The second order should not feel like the first.</h2></div>
          <p>Prior details become a starting point, while garment availability and current pricing are reconfirmed.</p>
        </div>
        <div className="reorder-grid">
          {dashboardPreviewReorders.map((item) => (
            <article key={item.title}>
              <span>Demo reorder</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <small>{item.note}</small>
              <button type="button" disabled>Start sample reorder</button>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--contrast saved-designs">
        <div className="account-section-heading"><div><span className="eyebrow">Saved assets</span><h2>Artwork should become reusable business memory.</h2></div></div>
        <div className="saved-design-grid">
          {['Primary logo', 'One-color embroidery mark', 'Back graphic', 'Event lockup'].map((name, index) => (
            <article key={name}>
              <div><span>DEMO</span><b>{String(index + 1).padStart(2, '0')}</b></div>
              <h3>{name}</h3>
              <p>Future account asset with approval status, production notes, and linked projects.</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export { CART_EVENT, CART_KEY, safeReadBag };
