import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  customerProjects,
  proofPreview,
  reorderStartingPoints,
  savedDesigns,
  type CustomerProject,
} from '../content/customerWorkspace';
import {
  findStoreProduct,
  storeCategories,
  storeCollections,
  storeProducts,
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

type AccountTab = 'Overview' | 'Projects' | 'Proofs' | 'Reorders' | 'Designs';
type ProofDecision = 'pending' | 'approved' | 'changes';

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

function CommerceNotice({ children }: { children: ReactNode }) {
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
      <div className="product-media__top"><span>{product.badge}</span><small>Development visual</small></div>
      <img src={product.image} alt={`${product.name} development garment visualization`} />
      <div className="product-media__caption"><small>{product.mediaLabel}</small><b>{product.decoration}</b></div>
    </div>
  );
}

function ProductCard({ product }: { product: StoreProduct }) {
  return (
    <a className="product-card" href={productPath(product)}>
      <ProductMedia product={product} compact />
      <div className="product-card__body">
        <div className="product-card__meta"><span>{product.category}</span><b>Quote-based</b></div>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <div className="product-card__footer"><small>{product.bestFor}</small><strong>Build project →</strong></div>
      </div>
    </a>
  );
}

function ProjectTimeline({ project }: { project: CustomerProject }) {
  return (
    <ol className="customer-timeline" aria-label={`${project.title} project timeline`}>
      {project.timeline.map((step) => (
        <li key={step.label} className={`is-${step.state}`}>
          <i aria-hidden="true" />
          <div><strong>{step.label}</strong><span>{step.detail}</span></div>
        </li>
      ))}
    </ol>
  );
}

export function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof storeCategories)[number]>('All');
  const filteredProducts = useMemo(
    () => activeCategory === 'All' ? storeProducts : storeProducts.filter((product) => product.category === activeCategory),
    [activeCategory],
  );
  const heroProduct = storeProducts.find((product) => product.slug === 'heavyweight-creator-hoodie') ?? storeProducts[0];

  return (
    <>
      <section className="commerce-hero commerce-hero--editorial">
        <div className="commerce-hero__copy">
          <span className="eyebrow">Custom apparel storefront</span>
          <h1>Shop a direction. Build the order around your people.</h1>
          <p>Browse garment starting points by how they will actually be used, configure what you already know, and keep the project together from first idea through future reorder.</p>
          <div className="commerce-hero__actions"><a className="button" href="#collections">Shop collections</a><a className="text-link" href="/account">Customer workspace →</a></div>
          <div className="commerce-hero__signals"><span>Quote-based custom production</span><span>Proof before production</span><span>Reorder-ready structure</span></div>
        </div>
        {heroProduct && <a className="commerce-featured-product" href={productPath(heroProduct)}><ProductMedia product={heroProduct} /><div><span>Featured starting point</span><strong>{heroProduct.name}</strong><small>Configure product →</small></div></a>}
      </section>

      <section className="section commerce-intro">
        <CommerceNotice>Garment visuals are development placeholders. Supplier-linked products, real photography, live inventory, approved production capabilities, pricing, and payment will replace preview data as the business becomes ready for them.</CommerceNotice>
      </section>

      <section id="collections" className="section store-collections">
        <div className="section-heading"><div><span className="eyebrow">Shop by purpose</span><h2>Collections built around the job the apparel needs to do.</h2></div><p>Customers should not need to understand production terminology before they can find the right starting point.</p></div>
        <div className="store-collection-grid">
          {storeCollections.map((collection) => (
            <a key={collection.code} href={collection.href} onClick={() => {
              const firstProduct = findStoreProduct(collection.productSlugs[0] ?? '');
              if (firstProduct) setActiveCategory(firstProduct.category);
            }}>
              <span>{collection.code}</span><h3>{collection.title}</h3><p>{collection.description}</p><small>{collection.productSlugs.length} starting products</small><b>View collection →</b>
            </a>
          ))}
        </div>
      </section>

      <section id="catalog" className="section shop-catalog section--contrast">
        <div className="shop-toolbar">
          <div><span className="eyebrow">Product starting points</span><h2>Choose the base. Customize the project.</h2><p>{filteredProducts.length} product pathway{filteredProducts.length === 1 ? '' : 's'} shown</p></div>
          <div className="shop-filters" aria-label="Filter catalog">
            {storeCategories.map((category) => <button key={category} type="button" className={activeCategory === category ? 'is-active' : undefined} onClick={() => setActiveCategory(category)}>{category}</button>)}
          </div>
        </div>
        <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
      </section>

      <section className="section commerce-shop-assist">
        <div><span className="eyebrow">Not seeing the right base?</span><h2>The catalog should guide custom work, not limit it.</h2><p>Customers with an exact garment, unusual placement, mixed apparel kit, or idea that does not fit the catalog can still begin through custom intake.</p></div><a className="button" href="/start-order">Start a custom request</a>
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
    return <section className="commerce-empty-page"><span className="eyebrow">Product not found</span><h1>That product is not in the current catalog.</h1><p>The catalog is still being developed as production capabilities and supplier choices are confirmed.</p><a className="button" href="/shop">Return to shop</a></section>;
  }

  const selectedProduct = product;
  const related = storeProducts.filter((item) => item.slug !== selectedProduct.slug && item.category === selectedProduct.category).slice(0, 3);

  function addToBag() {
    const current = safeReadBag();
    const item: ProjectBagItem = { id: `${selectedProduct.slug}-${Date.now()}`, productSlug: selectedProduct.slug, color, size, quantity: Math.max(1, quantity), decoration: selectedProduct.decoration };
    saveBag([...current, item]);
    setAdded(true);
  }

  return (
    <>
      <section className="product-detail product-detail--premium">
        <div className="product-detail__media">
          <ProductMedia product={selectedProduct} />
          <div className="product-detail__thumbs" aria-label="Planned product photography slots"><span className="is-active">Garment</span><span>Decoration detail</span><span>Placement</span><span>On-body</span></div>
          <p className="product-media-disclaimer">Development garment visualization. Final product photography and supplier-specific details will replace this media before live commerce.</p>
        </div>
        <div className="product-detail__copy">
          <a className="commerce-breadcrumb" href="/shop">Shop / {selectedProduct.category}</a>
          <span className="product-detail__badge">{selectedProduct.badge}</span>
          <h1>{selectedProduct.name}</h1>
          <p className="product-detail__description">{selectedProduct.description}</p>
          <div className="product-detail__pricing"><strong>Built to quote</strong><span>Price is confirmed after exact garment, quantity, artwork, decoration, supplier availability, and fulfillment review.</span></div>

          <div className="product-builder">
            <div className="product-builder__heading"><span>Build this project</span><small>Selections are starting details, not a production approval.</small></div>
            <fieldset className="choice-group"><legend>Garment color <b>{color}</b></legend><div>{selectedProduct.colors.map((option) => <button type="button" key={option} className={color === option ? 'is-active' : undefined} onClick={() => setColor(option)}>{option}</button>)}</div></fieldset>
            <fieldset className="choice-group"><legend>Starting size <b>{size}</b></legend><div>{selectedProduct.sizes.map((option) => <button type="button" key={option} className={size === option ? 'is-active' : undefined} onClick={() => setSize(option)}>{option}</button>)}</div></fieldset>
            <label className="quantity-control" htmlFor="product-quantity"><span>Estimated quantity</span><input id="product-quantity" type="number" min="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /><small>Final size breakdown can be organized during review.</small></label>
            <div className="product-builder__decoration"><span>Decoration path</span><strong>{selectedProduct.decoration}</strong><small>Placement and production method are confirmed with artwork.</small></div>
            <button className="button product-detail__add" type="button" onClick={addToBag}>Add configured product</button>
            {added && <div className="add-confirmation" role="status"><span>Added to your project bag.</span><a href="/cart">Review bag →</a></div>}
          </div>

          <dl className="product-detail__facts"><div><dt>Best for</dt><dd>{selectedProduct.bestFor}</dd></div><div><dt>Quantity approach</dt><dd>{selectedProduct.quantityGuidance}</dd></div><div><dt>Preview size range</dt><dd>{selectedProduct.sizes.join(', ')}</dd></div></dl>
        </div>
      </section>

      <section className="section product-detail__process">
        <div className="section-heading"><div><span className="eyebrow">What comes after the bag</span><h2>Shopping gets the project moving. Approval makes it producible.</h2></div><p>The checkout flow captures context; pricing, exact product selection, artwork, placement, and proof remain explicit checkpoints.</p></div>
        <div className="commerce-principle-grid"><article><span>01</span><h3>Build the product mix</h3><p>Add apparel starting points together so a staff kit, team program, or creator drop can stay one project.</p></article><article><span>02</span><h3>Review real variables</h3><p>BEE confirms supplier options, artwork readiness, decoration feasibility, size breakdown, and schedule.</p></article><article><span>03</span><h3>Approve with context</h3><p>A proof and quote become customer-visible checkpoints before production begins.</p></article></div>
      </section>

      {related.length > 0 && <section className="section section--contrast related-products"><div className="section-heading"><div><span className="eyebrow">Build the rest of the kit</span><h2>More from {selectedProduct.category}.</h2></div></div><div className="product-grid product-grid--related">{related.map((item) => <ProductCard key={item.slug} product={item} />)}</div></section>}
    </>
  );
}

export function CartPage() {
  const [items, setItems] = useState<ProjectBagItem[]>(() => safeReadBag());
  useEffect(() => { const sync = () => setItems(safeReadBag()); window.addEventListener(CART_EVENT, sync); window.addEventListener('storage', sync); return () => { window.removeEventListener(CART_EVENT, sync); window.removeEventListener('storage', sync); }; }, []);

  function updateQuantity(id: string, quantity: number) { const next = items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item); setItems(next); saveBag(next); }
  function removeItem(id: string) { const next = items.filter((item) => item.id !== id); setItems(next); saveBag(next); }
  const totalPieces = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="cart-page">
      <div className="cart-page__heading"><div><span className="eyebrow">Project bag</span><h1>One project can include more than one garment.</h1></div><p>{items.length === 0 ? 'Your project bag is empty.' : `${items.length} configured product${items.length === 1 ? '' : 's'} · ${totalPieces} estimated piece${totalPieces === 1 ? '' : 's'}`}</p></div>
      {items.length === 0 ? <div className="bag-empty"><span>Nothing configured yet</span><h2>Start in the shop and collect the pieces you want reviewed together.</h2><p>The project bag is stored in this browser during the frontend preview.</p><a className="button" href="/shop">Browse starting products</a></div> : (
        <div className="cart-layout"><div className="cart-items">{items.map((item) => { const product = findStoreProduct(item.productSlug); if (!product) return null; return <article className="cart-item" key={item.id}><ProductMedia product={product} compact /><div className="cart-item__copy"><span>{product.category}</span><h2><a href={productPath(product)}>{product.name}</a></h2><dl><div><dt>Color</dt><dd>{item.color}</dd></div><div><dt>Starting size</dt><dd>{item.size}</dd></div><div><dt>Decoration</dt><dd>{item.decoration}</dd></div></dl><div className="cart-item__controls"><label>Quantity<input type="number" min="1" value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} /></label><button type="button" onClick={() => removeItem(item.id)}>Remove</button></div></div></article>; })}</div><aside className="bag-summary"><span className="eyebrow">Project summary</span><div><small>Configured products</small><strong>{items.length}</strong></div><div><small>Estimated pieces</small><strong>{totalPieces}</strong></div><div><small>Pricing</small><strong>Prepared after review</strong></div><p>No payment is collected from this preview. Project review gathers the context needed to prepare a real quote workflow later.</p><a className="button" href="/checkout">Review project details</a><a className="text-link" href="/shop">Keep shopping →</a></aside></div>
      )}
    </section>
  );
}

export function CheckoutPage() {
  const [items] = useState<ProjectBagItem[]>(() => safeReadBag());
  const [prepared, setPrepared] = useState(false);
  const totalPieces = items.reduce((sum, item) => sum + item.quantity, 0);
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (items.length > 0) setPrepared(true); }
  if (items.length === 0) return <section className="commerce-empty-page"><span className="eyebrow">Project review</span><h1>Your project bag needs at least one item.</h1><p>Add a garment configuration before entering the project review flow.</p><a className="button" href="/shop">Browse the shop</a></section>;

  return (
    <section className="checkout-page">
      <div className="checkout-page__heading"><span className="eyebrow">Project review</span><h1>Give the production team the context behind the bag.</h1><p>This step bridges shopping into BEE's future quote workflow. It does not transmit data or collect payment yet.</p></div>
      <CommerceNotice>This is a frontend workflow preview. Secure account storage, artwork uploads, submission, payments, notifications, and production records are not connected yet.</CommerceNotice>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <fieldset><legend>Contact</legend><label>Full name<input required autoComplete="name" /></label><label>Email<input required type="email" autoComplete="email" /></label><label>Phone<input type="tel" autoComplete="tel" /></label><label>Organization or brand<input autoComplete="organization" /></label></fieldset>
          <fieldset><legend>Project context</legend><label>Target date<input type="date" /></label><label>Artwork status<select defaultValue=""><option value="">Select one</option><option>Production-ready artwork available</option><option>Artwork exists but needs review</option><option>Concept only</option><option>Design help needed</option></select></label><label>Fulfillment preference<select defaultValue=""><option value="">Not decided</option><option>Pickup</option><option>Bulk delivery</option><option>Shipping</option><option>Individual fulfillment may be needed</option></select></label><label>Order type<select defaultValue=""><option value="">Select one</option><option>Individual custom order</option><option>Business / organization</option><option>School / team</option><option>Creator merchandise</option><option>Event / community</option></select></label><label className="checkout-form__wide">Notes<textarea rows={6} placeholder="Add size breakdowns, placement notes, personalization, event information, or anything else the production team should know." /></label></fieldset>
          <label className="checkout-confirm"><input type="checkbox" required /><span>I understand this preview prepares a request for review and does not place a production order or charge a payment method.</span></label>
          <button className="button" type="submit">Prepare project request</button>
          {prepared && <div className="checkout-prepared" role="status"><strong>Project preview prepared.</strong><span>No information was transmitted. In the production version, this creates a saved request, reference number, notification, and account workspace entry.</span><a href="/account">View customer workspace preview →</a></div>}
        </form>
        <aside className="checkout-summary"><span className="eyebrow">Your bag</span>{items.map((item) => { const product = findStoreProduct(item.productSlug); return product ? <div className="checkout-summary__item" key={item.id}><strong>{product.name}</strong><span>{item.quantity} × {item.color} · {item.size}</span></div> : null; })}<div className="checkout-summary__total"><span>Estimated pieces</span><strong>{totalPieces}</strong></div><div className="checkout-summary__pricing"><span>Price</span><strong>Confirmed after review</strong></div><a className="text-link" href="/cart">Edit project bag →</a></aside>
      </div>
    </section>
  );
}

function AccountTabButton({ tab, activeTab, onSelect }: { tab: AccountTab; activeTab: AccountTab; onSelect: (tab: AccountTab) => void }) {
  return <button type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'is-active' : undefined} onClick={() => onSelect(tab)}>{tab}</button>;
}

export function AccountPage() {
  const [bagCount, setBagCount] = useState(() => safeReadBag().length);
  const [activeTab, setActiveTab] = useState<AccountTab>('Overview');
  const [selectedProjectId, setSelectedProjectId] = useState(customerProjects[1]?.id ?? customerProjects[0]?.id ?? '');
  const [proofDecision, setProofDecision] = useState<ProofDecision>('pending');
  const [reorderMessage, setReorderMessage] = useState('');

  useEffect(() => { const sync = () => setBagCount(safeReadBag().length); window.addEventListener(CART_EVENT, sync); window.addEventListener('storage', sync); return () => { window.removeEventListener(CART_EVENT, sync); window.removeEventListener('storage', sync); }; }, []);

  const selectedProject = customerProjects.find((project) => project.id === selectedProjectId) ?? customerProjects[0];
  const approvalCount = customerProjects.filter((project) => project.stage === 'Proof').length;

  function startReorder(productSlug: string) {
    const product = findStoreProduct(productSlug);
    if (!product) return;
    const current = safeReadBag();
    const item: ProjectBagItem = { id: `reorder-${product.slug}-${Date.now()}`, productSlug: product.slug, color: product.colors[0] ?? '', size: product.sizes[0] ?? '', quantity: 12, decoration: product.decoration };
    saveBag([...current, item]);
    setBagCount(current.length + 1);
    setReorderMessage(`${product.name} was added to the project bag as a reorder starting point.`);
  }

  return (
    <>
      <section className="account-hero account-hero--workspace">
        <div><span className="eyebrow">Customer workspace</span><h1>The account should remember the project so the customer does not have to.</h1><p>Quotes, proof decisions, production status, approved artwork, and reorders belong in one customer-facing workspace built around what needs attention next.</p><div className="account-hero__actions"><a className="button" href="/shop">Start another project</a><a className="text-link" href="/cart">Current bag ({bagCount}) →</a></div></div>
        <div className="account-identity-card"><span>Interface preview</span><strong>Demo customer workspace</strong><small>Authentication and real customer data are not connected</small><div><b>{bagCount}</b><span>configured product{bagCount === 1 ? '' : 's'} in this browser</span></div></div>
      </section>

      <section className="section account-preview-note"><CommerceNotice>Every project, proof, asset, status, and reorder shown in this workspace is intentionally labeled demo data. The interactions demonstrate the future customer experience and do not submit real approvals or represent real sales.</CommerceNotice></section>

      <section className="account-shell">
        <aside className="account-navigation">
          <span>Workspace</span>
          <div role="tablist" aria-label="Customer workspace sections">{(['Overview', 'Projects', 'Proofs', 'Reorders', 'Designs'] as const).map((tab) => <AccountTabButton key={tab} tab={tab} activeTab={activeTab} onSelect={setActiveTab} />)}</div>
          <div className="account-navigation__support"><small>Need a different order?</small><a href="/start-order">Start custom intake →</a></div>
        </aside>

        <main className="account-panel">
          {activeTab === 'Overview' && (
            <div className="account-tab-content">
              <div className="account-section-heading"><div><span className="eyebrow">Overview</span><h2>Attention first. History second.</h2></div><span className="demo-chip">Demo workspace</span></div>
              <div className="account-metrics"><article><span>Active projects</span><strong>{customerProjects.length}</strong><small>Demo data</small></article><article><span>Needs approval</span><strong>{approvalCount}</strong><small>Demo data</small></article><article><span>Reorder starting points</span><strong>{reorderStartingPoints.length}</strong><small>Demo data</small></article><article><span>Saved designs</span><strong>{savedDesigns.length}</strong><small>Demo data</small></article></div>

              <div className="account-attention-grid">
                <article className="attention-card attention-card--priority"><span>Needs your attention</span><h3>Creator heavyweight hoodie proof</h3><p>The sample proof is positioned as the next customer action rather than burying approval inside order history.</p><button type="button" onClick={() => setActiveTab('Proofs')}>Review proof preview →</button></article>
                {bagCount === 0 ? <article className="attention-card"><span>Current project bag</span><h3>No products configured yet.</h3><p>Start in the shop and combine the pieces you want reviewed as one project.</p><a href="/shop">Browse products →</a></article> : <article className="attention-card"><span>Current project bag</span><h3>{bagCount} configured product{bagCount === 1 ? '' : 's'} waiting.</h3><p>Continue building the project or move into context review when the product mix is ready.</p><a href="/cart">Open project bag →</a></article>}
              </div>

              <div className="account-section-heading account-section-heading--sub"><div><span className="eyebrow">Recent projects</span><h2>One status language across the relationship.</h2></div><button type="button" onClick={() => setActiveTab('Projects')}>View all demo projects →</button></div>
              <div className="project-list project-list--overview">{customerProjects.map((project) => <article key={project.id}><div className="project-list__top"><span>{project.label}</span><b>{project.status}</b></div><h3>{project.title}</h3><small>{project.updated}</small><div className="project-progress"><i style={{ width: `${project.progress}%` }} /></div><div className="project-list__next"><span>Next step</span><strong>{project.nextAction}</strong></div></article>)}</div>
            </div>
          )}

          {activeTab === 'Projects' && (
            <div className="account-tab-content">
              <div className="account-section-heading"><div><span className="eyebrow">Projects</span><h2>Quote to delivery in one timeline.</h2></div></div>
              <div className="project-workspace">
                <div className="project-selector">{customerProjects.map((project) => <button type="button" key={project.id} className={selectedProject?.id === project.id ? 'is-active' : undefined} onClick={() => setSelectedProjectId(project.id)}><span>{project.stage}</span><strong>{project.title}</strong><small>{project.status}</small></button>)}</div>
                {selectedProject && <div className="project-detail-panel"><div className="project-detail-panel__heading"><div><span>{selectedProject.label}</span><h3>{selectedProject.title}</h3><small>{selectedProject.updated}</small></div><b>{selectedProject.status}</b></div><div className="project-detail-panel__next"><span>Current next step</span><strong>{selectedProject.nextAction}</strong></div><ProjectTimeline project={selectedProject} /></div>}
              </div>
            </div>
          )}

          {activeTab === 'Proofs' && (
            <div className="account-tab-content">
              <div className="account-section-heading"><div><span className="eyebrow">Proof review</span><h2>Approval should be impossible to misunderstand.</h2></div><span className="demo-chip">No real approval submitted</span></div>
              <div className="proof-workspace">
                <div className="proof-preview"><div className="proof-preview__canvas"><span>DEMO PROOF</span><div className="proof-preview__garment"><i>ARTWORK</i></div><small>Development approval interface</small></div></div>
                <div className="proof-review"><span>{proofPreview.version}</span><h3>{proofPreview.title}</h3><dl><div><dt>Placement</dt><dd>{proofPreview.placement}</dd></div><div><dt>Garment</dt><dd>{proofPreview.garment}</dd></div></dl><p>{proofPreview.note}</p><label>Revision note<textarea rows={5} placeholder="In production this would be required when requesting a change." /></label><div className="proof-actions"><button type="button" className="button" onClick={() => setProofDecision('approved')}>Approve demo proof</button><button type="button" onClick={() => setProofDecision('changes')}>Request demo changes</button></div>{proofDecision !== 'pending' && <div className={`proof-decision is-${proofDecision}`} role="status"><strong>{proofDecision === 'approved' ? 'Demo approval selected.' : 'Demo revision request selected.'}</strong><span>This state changed only in your browser. No production instruction or customer approval was transmitted.</span><button type="button" onClick={() => setProofDecision('pending')}>Reset demo decision</button></div>}</div>
              </div>
            </div>
          )}

          {activeTab === 'Reorders' && (
            <div className="account-tab-content">
              <div className="account-section-heading"><div><span className="eyebrow">Reorders</span><h2>The second order starts with what was already learned.</h2></div><p>Prior configurations are a starting point; availability, pricing, quantities, sizes, artwork, and timing still get reconfirmed.</p></div>
              {reorderMessage && <div className="reorder-message" role="status">{reorderMessage}<a href="/cart">Open project bag →</a></div>}
              <div className="reorder-grid">{reorderStartingPoints.map((item) => <article key={item.title}><span>Demo reorder starting point</span><h3>{item.title}</h3><p>{item.detail}</p><small>{item.note}</small><button type="button" onClick={() => startReorder(item.productSlug)}>Build from this configuration →</button></article>)}</div>
            </div>
          )}

          {activeTab === 'Designs' && (
            <div className="account-tab-content">
              <div className="account-section-heading"><div><span className="eyebrow">Saved designs</span><h2>Artwork becomes reusable production memory.</h2></div><a className="text-link" href="/shop">Use artwork in a new project →</a></div>
              <div className="saved-design-grid saved-design-grid--detailed">{savedDesigns.map((asset, index) => <article key={asset.name}><div className="saved-design__preview"><span>DEMO</span><b>{String(index + 1).padStart(2, '0')}</b><i /></div><div><span>{asset.type}</span><h3>{asset.name}</h3><p>{asset.use}</p><small>{asset.status}</small></div></article>)}</div>
              <div className="asset-empty-state"><span>Future asset controls</span><h3>No public upload workflow is connected yet.</h3><p>The production account will support controlled uploads, version history, approval state, production notes, and links back to the projects that used each file.</p></div>
            </div>
          )}
        </main>
      </section>
    </>
  );
}

export { CART_EVENT, CART_KEY, safeReadBag };
