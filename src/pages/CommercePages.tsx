import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { findStoreProduct, type StoreProduct } from '../content/storeContent';
import {
  CART_EVENT,
  PROJECT_EVENT,
  createProject,
  getDraft,
  readBag,
  readProjectDraft,
  saveBag,
  saveProjectDraft,
  type BeeProject,
  type ProjectBagItem,
  type ProjectIntake,
} from '../data/projectStore';

export type { ProjectBagItem } from '../data/projectStore';
export { CART_EVENT, CART_KEY, readBag as safeReadBag } from '../data/projectStore';

function StudioLink({ item, product }: { item: ProjectBagItem; product: StoreProduct }) {
  const garment = product.image.includes('hoodie') ? 'hoodie' : product.image.includes('polo') ? 'polo' : 'tee';
  return <a className="text-link" href={item.draftId ? `/studio?draft=${encodeURIComponent(item.draftId)}` : `/studio?garment=${garment}`}>{item.draftId ? 'Edit exact design →' : 'Edit in Studio →'}</a>;
}

function ProjectItemVisual({ product }: { product: StoreProduct }) {
  return <div className="project-item-visual"><img src={product.image} alt="" /></div>;
}

export function CartPage() {
  const [items, setItems] = useState<ProjectBagItem[]>(readBag);

  useEffect(() => {
    const sync = () => setItems(readBag());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener(PROJECT_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(CART_EVENT, sync); window.removeEventListener(PROJECT_EVENT, sync); window.removeEventListener('storage', sync); };
  }, []);

  function updateQuantity(id: string, quantity: number) {
    const next = items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item);
    setItems(next); saveBag(next);
  }

  function removeItem(id: string) {
    const next = items.filter((item) => item.id !== id);
    setItems(next); saveBag(next);
  }

  const totalPieces = items.reduce((sum, item) => sum + item.quantity, 0);

  return <section className="project-bag-page">
    <header className="workspace-heading"><div><span className="eyebrow">Project bag</span><h1>Your custom pieces for this request.</h1></div><p>{items.length === 0 ? 'Nothing configured yet.' : `${items.length} design${items.length === 1 ? '' : 's'} · ${totalPieces} estimated piece${totalPieces === 1 ? '' : 's'}`}</p></header>
    {items.length === 0 ? <div className="clean-empty-state"><span>No project items</span><h2>Start in Studio.</h2><p>Save a mockup and it will stay connected through project review.</p><a className="button" href="/studio">Open BEE Studio</a></div> : <div className="project-bag-layout">
      <div className="project-bag-items">{items.map((item) => {
        const product = findStoreProduct(item.productSlug); if (!product) return null;
        const draft = getDraft(item.draftId);
        return <article className="project-bag-item" key={item.id}><ProjectItemVisual product={product} /><div className="project-bag-item__copy"><span>{draft ? 'Saved Studio design' : product.category}</span><h2>{draft?.name || product.name}</h2><dl><div><dt>Garment</dt><dd>{product.name}</dd></div><div><dt>Color</dt><dd>{item.color}</dd></div><div><dt>Size</dt><dd>{item.size}</dd></div><div><dt>Decoration</dt><dd>{item.decoration}</dd></div></dl><div className="project-bag-item__actions"><label>Estimated quantity<input type="number" min="1" value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} /></label><StudioLink item={item} product={product} /><button type="button" onClick={() => removeItem(item.id)}>Remove</button></div></div></article>;
      })}</div>
      <aside className="project-bag-summary"><span className="eyebrow">Next</span><h2>Add the project details.</h2><dl><div><dt>Designs</dt><dd>{items.length}</dd></div><div><dt>Estimated pieces</dt><dd>{totalPieces}</dd></div><div><dt>Pricing</dt><dd>Prepared after review</dd></div></dl><p>No payment or production commitment happens here.</p><a className="button" href="/project-review">Continue to project review</a><a className="text-link" href="/studio">Add another design →</a></aside>
    </div>}
  </section>;
}

function titleForInput(type: ProjectIntake['type']) {
  if (type === 'bulk') return 'Group / bulk order';
  if (type === 'creator') return 'Creator merchandise';
  if (type === 'unsure') return 'Project to review';
  return 'Custom apparel';
}

export function ProjectReviewPage() {
  const [items, setItems] = useState<ProjectBagItem[]>(readBag);
  const [data, setData] = useState<ProjectIntake>(readProjectDraft);
  const [submitted, setSubmitted] = useState<BeeProject | null>(null);
  const totalPieces = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const sync = () => setItems(readBag());
    window.addEventListener(CART_EVENT, sync); window.addEventListener(PROJECT_EVENT, sync);
    return () => { window.removeEventListener(CART_EVENT, sync); window.removeEventListener(PROJECT_EVENT, sync); };
  }, []);

  function update<K extends keyof ProjectIntake>(key: K, value: ProjectIntake[K]) {
    const next = { ...data, [key]: value }; setData(next); saveProjectDraft({ [key]: value });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const project = createProject(data, items);
    setSubmitted(project); setItems([]);
  }

  if (submitted) return <section className="project-submitted"><span className="eyebrow">Request saved</span><h1>{submitted.reference}</h1><p>Your browser project now appears in the Customer Workspace with the submitted designs and project details attached.</p><div><a className="button" href="/account">Open customer workspace</a><a className="text-link" href="/studio">Start another design →</a></div></section>;

  return <section className="project-review-page">
    <header className="workspace-heading"><div><span className="eyebrow">Project review</span><h1>Finish the request, then keep it in your workspace.</h1></div><p>{items.length > 0 ? `${items.length} design${items.length === 1 ? '' : 's'} · ${totalPieces} estimated pieces` : 'No Studio design is required to start a request.'}</p></header>
    <div className="project-review-layout">
      <form className="project-review-form" onSubmit={handleSubmit}>
        <fieldset><legend>Project</legend><div className="review-field-grid"><label>Project type<select value={data.type} onChange={(e) => update('type', e.target.value as ProjectIntake['type'])}><option value="custom">Custom apparel</option><option value="bulk">Group / bulk order</option><option value="creator">Creator merchandise</option><option value="unsure">Not sure yet</option></select></label><label>Garment / item<input value={data.garment} onChange={(e) => update('garment', e.target.value)} placeholder="Example: black hoodies and tees" /></label><label>Estimated quantity<input value={data.quantity} onChange={(e) => update('quantity', e.target.value)} placeholder={totalPieces ? `${totalPieces} from Studio` : 'Example: 24–36'} /></label><label>Artwork status<select value={data.artwork} onChange={(e) => update('artwork', e.target.value)}><option value="">Choose one</option><option>Production-ready artwork available</option><option>Artwork exists but needs review</option><option>Concept or sketch only</option><option>Design help needed</option></select></label><label>Need-by date<input type="date" value={data.deadline} onChange={(e) => update('deadline', e.target.value)} /></label><label>Fulfillment<select value={data.fulfillment} onChange={(e) => update('fulfillment', e.target.value)}><option value="">Not decided</option><option>Pickup</option><option>Bulk delivery</option><option>Shipping</option><option>Individual fulfillment may be needed</option></select></label><label className="review-wide">Personalization / roster needs<input value={data.personalization} onChange={(e) => update('personalization', e.target.value)} placeholder="Names, numbers, departments, size collection, or none" /></label></div></fieldset>
        <fieldset><legend>Contact</legend><div className="review-field-grid"><label>Full name<input required value={data.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" /></label><label>Email<input required type="email" value={data.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" /></label><label>Phone<input type="tel" value={data.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" /></label><label>Organization / brand<input value={data.organization} onChange={(e) => update('organization', e.target.value)} autoComplete="organization" /></label><label className="review-wide">Notes<textarea rows={5} value={data.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Sizes, colors, event context, placements, or questions." /></label></div></fieldset>
        <label className="review-confirm"><input required type="checkbox" /><span>I understand this browser prototype creates a local project record and does not charge a payment method or begin production.</span></label><button className="button" type="submit">Create browser project</button>
      </form>
      <aside className="project-review-summary"><span className="eyebrow">Project summary</span><strong>{titleForInput(data.type)}</strong>{items.length === 0 ? <p>No Studio designs attached. BEE can still review the request.</p> : items.map((item) => { const product = findStoreProduct(item.productSlug); const draft = getDraft(item.draftId); return product ? <div key={item.id}><strong>{draft?.name || product.name}</strong><span>{item.quantity} × {item.color} · {item.size}</span></div> : null; })}<footer><span>Estimated pieces</span><strong>{totalPieces || data.quantity || 'Not set'}</strong>{items.length > 0 && <a className="text-link" href="/cart">Edit project bag →</a>}</footer></aside>
    </div>
  </section>;
}

export function RetailCheckoutPage() {
  return <section className="clean-empty-state clean-empty-state--page"><span>Retail checkout</span><h1>Checkout activates when finished merchandise is available.</h1><p>Published Shop products will use price, cart, payment, shipping, and order confirmation. Custom work uses Project Review.</p><div><a className="button" href="/shop">Return to Shop</a><a className="text-link" href="/studio">Design custom apparel →</a></div></section>;
}
