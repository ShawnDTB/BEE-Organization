import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  customerProjects,
  proofPreview,
  reorderStartingPoints,
  savedDesigns,
  type CustomerProject,
} from '../content/customerWorkspace';
import { findStoreProduct, type StoreProduct } from '../content/storeContent';

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

type AccountTab = 'Overview' | 'Projects' | 'Quotes' | 'Proofs' | 'Payments' | 'Designs' | 'Reorders' | 'Messages';
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

function StudioLink({ product }: { product: StoreProduct }) {
  const garment = product.image.includes('hoodie') ? 'hoodie' : product.image.includes('polo') ? 'polo' : 'tee';
  return <a className="text-link" href={`/studio?garment=${garment}`}>Edit in Studio →</a>;
}

function ProjectItemVisual({ product }: { product: StoreProduct }) {
  return <div className="project-item-visual"><img src={product.image} alt="" /></div>;
}

function Notice({ children }: { children: ReactNode }) {
  return <div className="commerce-notice commerce-notice--quiet"><span>{children}</span></div>;
}

function ProjectTimeline({ project }: { project: CustomerProject }) {
  return (
    <ol className="customer-timeline" aria-label={`${project.title} project timeline`}>
      {project.timeline.map((step) => (
        <li key={step.label} className={`is-${step.state}`}><i aria-hidden="true" /><div><strong>{step.label}</strong><span>{step.detail}</span></div></li>
      ))}
    </ol>
  );
}

export function CartPage() {
  const [items, setItems] = useState<ProjectBagItem[]>(() => safeReadBag());

  useEffect(() => {
    const sync = () => setItems(safeReadBag());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(CART_EVENT, sync); window.removeEventListener('storage', sync); };
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
    <section className="project-bag-page">
      <header className="workspace-heading">
        <div><span className="eyebrow">Project bag</span><h1>Keep the custom pieces that belong to one request together.</h1></div>
        <p>{items.length === 0 ? 'Nothing configured yet.' : `${items.length} design${items.length === 1 ? '' : 's'} · ${totalPieces} estimated piece${totalPieces === 1 ? '' : 's'}`}</p>
      </header>

      {items.length === 0 ? (
        <div className="clean-empty-state"><span>No project items</span><h2>Start in Studio, then bring the design here for review.</h2><p>Shop is reserved for finished merchandise. Your custom concepts live in the project flow instead.</p><a className="button" href="/studio">Open BEE Studio</a></div>
      ) : (
        <div className="project-bag-layout">
          <div className="project-bag-items">
            {items.map((item) => {
              const product = findStoreProduct(item.productSlug);
              if (!product) return null;
              return (
                <article className="project-bag-item" key={item.id}>
                  <ProjectItemVisual product={product} />
                  <div className="project-bag-item__copy">
                    <span>{product.category}</span>
                    <h2>{product.name}</h2>
                    <dl><div><dt>Color</dt><dd>{item.color}</dd></div><div><dt>Starting size</dt><dd>{item.size}</dd></div><div><dt>Decoration</dt><dd>{item.decoration}</dd></div></dl>
                    <div className="project-bag-item__actions">
                      <label>Estimated quantity<input type="number" min="1" value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} /></label>
                      <StudioLink product={product} />
                      <button type="button" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="project-bag-summary">
            <span className="eyebrow">Next</span>
            <h2>Review the project context.</h2>
            <dl><div><dt>Designs</dt><dd>{items.length}</dd></div><div><dt>Estimated pieces</dt><dd>{totalPieces}</dd></div><div><dt>Pricing</dt><dd>Prepared after review</dd></div></dl>
            <p>This is a custom request, not a retail checkout. No payment or production commitment happens here.</p>
            <a className="button" href="/project-review">Continue to project review</a>
            <a className="text-link" href="/studio">Add another design →</a>
          </aside>
        </div>
      )}
    </section>
  );
}

export function ProjectReviewPage() {
  const [items] = useState<ProjectBagItem[]>(() => safeReadBag());
  const [prepared, setPrepared] = useState(false);
  const totalPieces = items.reduce((sum, item) => sum + item.quantity, 0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length > 0) setPrepared(true);
  }

  if (items.length === 0) {
    return <section className="clean-empty-state clean-empty-state--page"><span>Project review</span><h1>Add a design before reviewing the request.</h1><p>Build the custom piece in Studio first.</p><a className="button" href="/studio">Open Studio</a></section>;
  }

  return (
    <section className="project-review-page">
      <header className="workspace-heading"><div><span className="eyebrow">Project review</span><h1>Give BEE the context behind the designs.</h1></div><p>Custom work becomes a quote request here—not a checkout.</p></header>
      <Notice>Pre-launch preview: secure submission, artwork storage, project references, account linking, and notifications are not connected yet.</Notice>

      <div className="project-review-layout">
        <form className="project-review-form" onSubmit={handleSubmit}>
          <fieldset><legend>Contact</legend><div className="review-field-grid"><label>Full name<input required autoComplete="name" /></label><label>Email<input required type="email" autoComplete="email" /></label><label>Phone<input type="tel" autoComplete="tel" /></label><label>Organization / brand<input autoComplete="organization" /></label></div></fieldset>
          <fieldset><legend>Project</legend><div className="review-field-grid"><label>Need-by date<input type="date" /></label><label>Artwork status<select defaultValue=""><option value="">Choose one</option><option>Ready for production review</option><option>Needs cleanup or recreation</option><option>Concept only</option><option>Need design help</option></select></label><label>Fulfillment<select defaultValue=""><option value="">Not decided</option><option>Pickup</option><option>Bulk delivery</option><option>Shipping</option><option>Individual fulfillment may be needed</option></select></label><label>Project type<select defaultValue=""><option value="">Choose one</option><option>Individual custom</option><option>Business / organization</option><option>School / team</option><option>Creator merchandise</option><option>Event / community</option></select></label><label className="review-wide">Notes<textarea rows={5} placeholder="Size breakdowns, placements, personalization, event information, or questions." /></label></div></fieldset>
          <label className="review-confirm"><input required type="checkbox" /><span>I understand this prepares a custom project request and does not charge a payment method or begin production.</span></label>
          <button className="button" type="submit">Prepare quote request</button>
          {prepared && <div className="review-prepared" role="status"><strong>Project request prepared.</strong><span>No information was transmitted in this frontend preview. The production version will create a project ID and send confirmation.</span><a href="/account">View customer workspace preview →</a></div>}
        </form>

        <aside className="project-review-summary">
          <span className="eyebrow">Design summary</span>
          {items.map((item) => { const product = findStoreProduct(item.productSlug); return product ? <div key={item.id}><strong>{product.name}</strong><span>{item.quantity} × {item.color} · {item.size}</span></div> : null; })}
          <footer><span>Estimated pieces</span><strong>{totalPieces}</strong><a className="text-link" href="/cart">Edit project bag →</a></footer>
        </aside>
      </div>
    </section>
  );
}

export function RetailCheckoutPage() {
  return (
    <section className="clean-empty-state clean-empty-state--page">
      <span>Retail checkout</span>
      <h1>Checkout activates when finished merchandise is available.</h1>
      <p>Published Shop products will use a normal price, cart, payment, shipping, and order-confirmation flow. Custom apparel requests use Project Review instead.</p>
      <div><a className="button" href="/shop">Return to Shop</a><a className="text-link" href="/studio">Design custom apparel →</a></div>
    </section>
  );
}

function AccountTabButton({ tab, activeTab, onSelect }: { tab: AccountTab; activeTab: AccountTab; onSelect: (tab: AccountTab) => void }) {
  return <button type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'is-active' : undefined} onClick={() => onSelect(tab)}>{tab}</button>;
}

function PlaceholderWorkspace({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <div className="workspace-placeholder"><span>{eyebrow}</span><h2>{title}</h2><p>{copy}</p><small>Frontend structure only · no live customer data</small></div>;
}

export function AccountPage() {
  const [bagCount, setBagCount] = useState(() => safeReadBag().length);
  const [activeTab, setActiveTab] = useState<AccountTab>('Overview');
  const [selectedProjectId, setSelectedProjectId] = useState(customerProjects[1]?.id ?? customerProjects[0]?.id ?? '');
  const [proofDecision, setProofDecision] = useState<ProofDecision>('pending');
  const [reorderMessage, setReorderMessage] = useState('');

  useEffect(() => {
    const sync = () => setBagCount(safeReadBag().length);
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(CART_EVENT, sync); window.removeEventListener('storage', sync); };
  }, []);

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
    <section className="account-workspace-v3">
      <header className="account-workspace-v3__topbar">
        <div><span className="eyebrow">Customer workspace</span><h1>What needs your attention?</h1><p>Demo data shows the intended project relationship. Authentication and real customer records are not connected yet.</p></div>
        <div><a className="button" href="/studio">New design</a><a href="/cart">Project bag {bagCount > 0 ? `(${bagCount})` : ''}</a></div>
      </header>

      <div className="account-workspace-v3__layout">
        <aside className="account-nav-v3">
          <div role="tablist" aria-label="Customer workspace sections">{(['Overview', 'Projects', 'Quotes', 'Proofs', 'Payments', 'Designs', 'Reorders', 'Messages'] as const).map((tab) => <AccountTabButton key={tab} tab={tab} activeTab={activeTab} onSelect={setActiveTab} />)}</div>
          <small>Demo workspace · browser only</small>
        </aside>

        <main className="account-content-v3">
          {activeTab === 'Overview' && <div className="account-tab-v3">
            <div className="attention-strip"><article className="is-priority"><span>Needs approval</span><strong>{approvalCount}</strong><button type="button" onClick={() => setActiveTab('Proofs')}>Review proof →</button></article><article><span>Project bag</span><strong>{bagCount}</strong><a href="/cart">Open bag →</a></article><article><span>Active projects</span><strong>{customerProjects.length}</strong><button type="button" onClick={() => setActiveTab('Projects')}>View projects →</button></article></div>
            <section className="workspace-section"><header><span className="eyebrow">Next action</span><h2>Creator heavyweight hoodie proof</h2></header><div className="next-action-card"><div><strong>Awaiting approval</strong><p>Review the current placement and either approve it or request a revision.</p></div><button className="button" type="button" onClick={() => setActiveTab('Proofs')}>Review proof</button></div></section>
            <section className="workspace-section"><header><span className="eyebrow">Recent projects</span><h2>Status without digging through messages.</h2></header><div className="compact-project-list">{customerProjects.map((project) => <button key={project.id} type="button" onClick={() => { setSelectedProjectId(project.id); setActiveTab('Projects'); }}><span>{project.stage}</span><strong>{project.title}</strong><small>{project.status}</small><i><b style={{ width: `${project.progress}%` }} /></i></button>)}</div></section>
          </div>}

          {activeTab === 'Projects' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Projects</span><h2>One timeline from request to delivery.</h2></div></div><div className="project-workspace-v3"><div className="project-selector-v3">{customerProjects.map((project) => <button type="button" key={project.id} className={selectedProject?.id === project.id ? 'is-active' : undefined} onClick={() => setSelectedProjectId(project.id)}><span>{project.stage}</span><strong>{project.title}</strong><small>{project.status}</small></button>)}</div>{selectedProject && <article className="project-detail-v3"><header><div><span>{selectedProject.label}</span><h2>{selectedProject.title}</h2></div><b>{selectedProject.status}</b></header><div className="project-next-v3"><span>Next step</span><strong>{selectedProject.nextAction}</strong></div><ProjectTimeline project={selectedProject} /></article>}</div></div>}

          {activeTab === 'Quotes' && <PlaceholderWorkspace eyebrow="Quotes" title="Pricing should be its own approval checkpoint." copy="Production will show quote versions, garment/decoration line items, expiration, deposit requirements, and customer acceptance history here." />}

          {activeTab === 'Proofs' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Proof review</span><h2>Approve the exact production direction.</h2></div><span className="demo-chip">Demo only</span></div><div className="proof-workspace-v3"><div className="proof-canvas-v3"><span>DEMO PROOF</span><div>ARTWORK</div><small>Development approval interface</small></div><div className="proof-copy-v3"><span>{proofPreview.version}</span><h3>{proofPreview.title}</h3><dl><div><dt>Placement</dt><dd>{proofPreview.placement}</dd></div><div><dt>Garment</dt><dd>{proofPreview.garment}</dd></div></dl><label>Revision note<textarea rows={4} placeholder="Required in production when requesting a change." /></label><div><button className="button" type="button" onClick={() => setProofDecision('approved')}>Approve demo proof</button><button type="button" onClick={() => setProofDecision('changes')}>Request changes</button></div>{proofDecision !== 'pending' && <div className="proof-decision-v3" role="status"><strong>{proofDecision === 'approved' ? 'Demo approval selected.' : 'Demo revision selected.'}</strong><span>No instruction was transmitted.</span><button type="button" onClick={() => setProofDecision('pending')}>Reset</button></div>}</div></div></div>}

          {activeTab === 'Payments' && <PlaceholderWorkspace eyebrow="Payments" title="Deposits and balances belong with the project." copy="Production will show invoice state, deposits, final balances, payment receipts, refunds where applicable, and links back to the related quote/order." />}

          {activeTab === 'Designs' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Designs & files</span><h2>Reusable artwork, not lost attachments.</h2></div><a className="text-link" href="/studio">Create another design →</a></div><div className="design-file-grid">{savedDesigns.map((asset, index) => <article key={asset.name}><div><span>DEMO</span><b>{String(index + 1).padStart(2, '0')}</b></div><small>{asset.type}</small><h3>{asset.name}</h3><p>{asset.use}</p><span>{asset.status}</span></article>)}</div></div>}

          {activeTab === 'Reorders' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Reorders</span><h2>Start with what was already approved.</h2></div></div>{reorderMessage && <div className="reorder-message" role="status">{reorderMessage}<a href="/cart">Open bag →</a></div>}<div className="reorder-grid-v3">{reorderStartingPoints.map((item) => <article key={item.title}><span>Demo starting point</span><h3>{item.title}</h3><p>{item.detail}</p><small>{item.note}</small><button type="button" onClick={() => startReorder(item.productSlug)}>Build from this →</button></article>)}</div></div>}

          {activeTab === 'Messages' && <PlaceholderWorkspace eyebrow="Messages" title="Keep project communication attached to the project." copy="Production messaging should collect quote questions, proof revisions, pickup/shipping notices, and customer replies without forcing the team to reconstruct context from separate channels." />}
        </main>
      </div>
    </section>
  );
}

export { CART_EVENT, CART_KEY, safeReadBag };
