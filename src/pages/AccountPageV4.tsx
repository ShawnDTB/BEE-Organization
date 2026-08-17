import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  customerProjects,
  proofPreview,
  reorderStartingPoints,
  savedDesigns,
  type CustomerProject,
} from '../content/customerWorkspace';
import { findStoreProduct } from '../content/storeContent';
import { CART_EVENT, CART_KEY, safeReadBag, type ProjectBagItem } from './CommercePages';

const DRAFT_KEY = 'bee-studio-drafts-v1';
const NOTES_KEY = 'bee-project-notes-v1';

type AccountSection = 'Overview' | 'Projects' | 'Quotes' | 'Proofs' | 'Payments' | 'Designs' | 'Reorders' | 'Messages';
type ProofDecision = 'pending' | 'approved' | 'changes';
type BrowserDraft = { id: string; garment?: string; decoration?: string; size?: string; quantity?: number; createdAt?: string };
type BrowserNote = { id: string; projectId: string; body: string; createdAt: string };

function readLocalArray<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
}

function saveBag(items: ProjectBagItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
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

export function AccountPageV4() {
  const [bagCount, setBagCount] = useState(() => safeReadBag().length);
  const [drafts, setDrafts] = useState<BrowserDraft[]>(() => readLocalArray<BrowserDraft>(DRAFT_KEY));
  const [activeSection, setActiveSection] = useState<AccountSection>('Overview');
  const [selectedProjectId, setSelectedProjectId] = useState(customerProjects[1]?.id ?? customerProjects[0]?.id ?? '');
  const [proofDecision, setProofDecision] = useState<ProofDecision>('pending');
  const [reorderMessage, setReorderMessage] = useState('');
  const [notes, setNotes] = useState<BrowserNote[]>(() => readLocalArray<BrowserNote>(NOTES_KEY));
  const [noteDraft, setNoteDraft] = useState('');

  useEffect(() => {
    const sync = () => {
      setBagCount(safeReadBag().length);
      setDrafts(readLocalArray<BrowserDraft>(DRAFT_KEY));
    };
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener('storage', sync);
    window.addEventListener('focus', sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', sync);
    };
  }, []);

  const selectedProject = customerProjects.find((project) => project.id === selectedProjectId) ?? customerProjects[0];
  const approvalCount = customerProjects.filter((project) => project.stage === 'Proof').length;
  const activeNotes = useMemo(() => notes.filter((note) => note.projectId === selectedProjectId), [notes, selectedProjectId]);

  function startReorder(productSlug: string) {
    const product = findStoreProduct(productSlug);
    if (!product) return;
    const current = safeReadBag();
    const item: ProjectBagItem = {
      id: `reorder-${product.slug}-${Date.now()}`,
      productSlug: product.slug,
      color: product.colors[0] ?? '',
      size: product.sizes[0] ?? '',
      quantity: 12,
      decoration: product.decoration,
    };
    saveBag([...current, item]);
    setBagCount(current.length + 1);
    setReorderMessage(`${product.name} was added to the project bag as a reorder starting point.`);
  }

  function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = noteDraft.trim();
    if (!body || !selectedProjectId) return;
    const next: BrowserNote = { id: `note-${Date.now()}`, projectId: selectedProjectId, body, createdAt: new Date().toISOString() };
    const updated = [...notes, next];
    setNotes(updated);
    window.localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    setNoteDraft('');
  }

  const sections: AccountSection[] = ['Overview', 'Projects', 'Quotes', 'Proofs', 'Payments', 'Designs', 'Reorders', 'Messages'];

  return (
    <section className="account-workspace-v4">
      <header className="account-workspace-v3__topbar">
        <div><span className="eyebrow">Customer workspace</span><h1>Your projects, approvals, and saved work.</h1><p>Demo data is used for project history. Project bag items, Studio drafts, and saved notes come from this browser.</p></div>
        <div><a className="button" href="/studio">New design</a><a href="/cart">Project bag {bagCount > 0 ? `(${bagCount})` : ''}</a></div>
      </header>

      <div className="account-workspace-v3__layout">
        <aside className="account-nav-v3" aria-label="Customer workspace sections">
          <div>{sections.map((section) => <button key={section} type="button" aria-pressed={activeSection === section} className={activeSection === section ? 'is-active' : undefined} onClick={() => setActiveSection(section)}>{section}</button>)}</div>
          <small>Demo project history · browser-local tools</small>
        </aside>

        <div className="account-content-v3">
          {activeSection === 'Overview' && <div className="account-tab-v3">
            <div className="attention-strip attention-strip--four">
              <article className="is-priority"><span>Needs approval</span><strong>{approvalCount}</strong><button type="button" onClick={() => setActiveSection('Proofs')}>Review proof →</button></article>
              <article><span>Project bag</span><strong>{bagCount}</strong><a href="/cart">Open bag →</a></article>
              <article><span>Saved drafts</span><strong>{drafts.length}</strong><button type="button" onClick={() => setActiveSection('Designs')}>View drafts →</button></article>
              <article><span>Active projects</span><strong>{customerProjects.length}</strong><button type="button" onClick={() => setActiveSection('Projects')}>View projects →</button></article>
            </div>

            <section className="workspace-section"><header><span className="eyebrow">Next action</span><h2>Review the hoodie proof.</h2></header><div className="next-action-card"><div><strong>Awaiting approval</strong><p>Check the placement and approve it or request a revision.</p></div><button className="button" type="button" onClick={() => setActiveSection('Proofs')}>Review proof</button></div></section>

            <section className="workspace-quick-actions" aria-label="Quick actions">
              <a href="/studio"><span>Design</span><strong>New custom piece</strong></a>
              <a href="/start-order?type=bulk"><span>Group order</span><strong>Start a bulk request</strong></a>
              <a href="/group-collector"><span>Roster</span><strong>Open Group Collector</strong></a>
              <button type="button" onClick={() => setActiveSection('Messages')}><span>Project notes</span><strong>Save a note</strong></button>
            </section>

            <section className="workspace-section"><header><span className="eyebrow">Recent projects</span><h2>Current status.</h2></header><div className="compact-project-list">{customerProjects.map((project) => <button key={project.id} type="button" onClick={() => { setSelectedProjectId(project.id); setActiveSection('Projects'); }}><span>{project.stage}</span><strong>{project.title}</strong><small>{project.status}</small><i><b style={{ width: `${project.progress}%` }} /></i></button>)}</div></section>
          </div>}

          {activeSection === 'Projects' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Projects</span><h2>Current project timelines.</h2></div></div><div className="project-workspace-v3"><div className="project-selector-v3">{customerProjects.map((project) => <button type="button" key={project.id} className={selectedProject?.id === project.id ? 'is-active' : undefined} onClick={() => setSelectedProjectId(project.id)}><span>{project.stage}</span><strong>{project.title}</strong><small>{project.status}</small></button>)}</div>{selectedProject && <article className="project-detail-v3"><header><div><span>{selectedProject.label}</span><h2>{selectedProject.title}</h2></div><b>{selectedProject.status}</b></header><div className="project-next-v3"><span>Next step</span><strong>{selectedProject.nextAction}</strong></div><ProjectTimeline project={selectedProject} /></article>}</div></div>}

          {activeSection === 'Quotes' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Quotes</span><h2>Pricing checkpoints.</h2></div><span className="demo-chip">Demo structure</span></div><div className="workspace-state-grid"><article><span>Staff polos + caps</span><strong>Needs project details</strong><dl><div><dt>Garments</dt><dd>Not final</dd></div><div><dt>Quantity</dt><dd>Not final</dd></div><div><dt>Pricing</dt><dd>Not prepared</dd></div></dl><button type="button" onClick={() => { setSelectedProjectId('demo-staff-kit'); setActiveSection('Projects'); }}>Open project →</button></article><article><span>Creator hoodie</span><strong>Quote stage complete</strong><p>The demo project has moved into proof review. Production pricing and approval history would remain attached here.</p><button type="button" onClick={() => setActiveSection('Proofs')}>Open proof →</button></article></div></div>}

          {activeSection === 'Proofs' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Proofs</span><h2>Review placement before production.</h2></div><span className="demo-chip">Demo only</span></div><div className="proof-workspace-v3"><div className="proof-canvas-v3"><span>DEMO PROOF</span><div>ARTWORK</div><small>Development approval interface</small></div><div className="proof-copy-v3"><span>{proofPreview.version}</span><h3>{proofPreview.title}</h3><dl><div><dt>Placement</dt><dd>{proofPreview.placement}</dd></div><div><dt>Garment</dt><dd>{proofPreview.garment}</dd></div></dl><label>Revision note<textarea rows={4} placeholder="What needs to change?" /></label><div><button className="button" type="button" onClick={() => setProofDecision('approved')}>Approve demo proof</button><button type="button" onClick={() => setProofDecision('changes')}>Request changes</button></div>{proofDecision !== 'pending' && <div className="proof-decision-v3" role="status"><strong>{proofDecision === 'approved' ? 'Demo approval selected.' : 'Demo revision selected.'}</strong><span>No instruction was transmitted.</span><button type="button" onClick={() => setProofDecision('pending')}>Reset</button></div>}</div></div></div>}

          {activeSection === 'Payments' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Payments</span><h2>No payment is due in this demo.</h2></div></div><div className="payment-roadmap"><div><span>01</span><strong>Quote approved</strong><p>A real project can expose its deposit requirement here.</p></div><div><span>02</span><strong>Deposit recorded</strong><p>Receipt and project status stay linked to the same order.</p></div><div><span>03</span><strong>Balance settled</strong><p>Final payment state appears before release or fulfillment when required.</p></div></div></div>}

          {activeSection === 'Designs' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Designs & files</span><h2>Saved work in one place.</h2></div><a className="text-link" href="/studio">Create another design →</a></div><section className="browser-drafts"><header><strong>Browser Studio drafts</strong><span>{drafts.length}</span></header>{drafts.length === 0 ? <p>No Studio drafts saved in this browser yet.</p> : <div>{drafts.slice().reverse().map((draft) => <article key={draft.id}><span>{draft.decoration || 'Decoration'}</span><strong>{draft.garment || 'Garment'} · {draft.size || 'Size not set'}</strong><small>{draft.quantity || 1} piece{draft.quantity === 1 ? '' : 's'}</small></article>)}</div>}</section><div className="design-file-grid">{savedDesigns.map((asset, index) => <article key={asset.name}><div><span>DEMO</span><b>{String(index + 1).padStart(2, '0')}</b></div><small>{asset.type}</small><h3>{asset.name}</h3><p>{asset.use}</p><span>{asset.status}</span></article>)}</div></div>}

          {activeSection === 'Reorders' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Reorders</span><h2>Start from an approved setup.</h2></div></div>{reorderMessage && <div className="reorder-message" role="status">{reorderMessage}<a href="/cart">Open bag →</a></div>}<div className="reorder-grid-v3">{reorderStartingPoints.map((item) => <article key={item.title}><span>Demo starting point</span><h3>{item.title}</h3><p>{item.detail}</p><small>{item.note}</small><button type="button" onClick={() => startReorder(item.productSlug)}>Build from this →</button></article>)}</div></div>}

          {activeSection === 'Messages' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Project notes</span><h2>Keep context with the project.</h2></div><span className="demo-chip">Browser only</span></div><div className="message-workspace-v4"><aside>{customerProjects.map((project) => <button key={project.id} type="button" className={selectedProjectId === project.id ? 'is-active' : undefined} onClick={() => setSelectedProjectId(project.id)}><strong>{project.title}</strong><small>{project.status}</small></button>)}</aside><section><header><strong>{selectedProject?.title ?? 'Project'}</strong><span>{activeNotes.length} saved note{activeNotes.length === 1 ? '' : 's'}</span></header><div className="message-thread-v4">{activeNotes.length === 0 ? <p>No browser notes saved for this project.</p> : activeNotes.map((note) => <article key={note.id}><p>{note.body}</p><small>{new Date(note.createdAt).toLocaleString()}</small></article>)}</div><form onSubmit={saveNote}><label>Save a project note<textarea rows={4} value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Example: Ask about switching the sleeve placement before the next proof." /></label><button className="button" type="submit">Save note in this browser</button><small>This does not send a message to BEE yet.</small></form></section></div></div>}
        </div>
      </div>
    </section>
  );
}
