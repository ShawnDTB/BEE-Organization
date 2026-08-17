import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { customerProjects, proofPreview, reorderStartingPoints, savedDesigns } from '../content/customerWorkspace';
import { findStoreProduct } from '../content/storeContent';
import {
  CART_EVENT,
  PROJECT_EVENT,
  deleteStudioDraft,
  duplicateStudioDraft,
  readBag,
  readDrafts,
  readProjectNotes,
  readProjects,
  renameStudioDraft,
  saveBag,
  saveProjectNote,
  type BeeProject,
  type ProjectBagItem,
  type ProjectNote,
  type ProjectTimelineStep,
  type StudioDraft,
} from '../data/projectStore';

type AccountSection = 'Overview' | 'Projects' | 'Quotes' | 'Proofs' | 'Payments' | 'Designs' | 'Reorders' | 'Messages';
type ProofDecision = 'pending' | 'approved' | 'changes';

type WorkspaceProject = {
  id: string;
  label: string;
  title: string;
  status: string;
  stage: string;
  progress: number;
  nextAction: string;
  timeline: readonly ProjectTimelineStep[];
  isLocal: boolean;
  reference?: string;
};

function normalizeLocal(project: BeeProject): WorkspaceProject {
  return {
    id: project.id,
    label: project.reference,
    reference: project.reference,
    title: project.title,
    status: project.status,
    stage: project.stage,
    progress: project.progress,
    nextAction: project.nextAction,
    timeline: project.timeline,
    isLocal: true,
  };
}

function normalizeDemo(project: (typeof customerProjects)[number]): WorkspaceProject {
  return { ...project, isLocal: false };
}

function ProjectTimeline({ project }: { project: WorkspaceProject }) {
  return <ol className="customer-timeline" aria-label={`${project.title} project timeline`}>{project.timeline.map((step) => <li key={step.label} className={`is-${step.state}`}><i aria-hidden="true" /><div><strong>{step.label}</strong><span>{step.detail}</span></div></li>)}</ol>;
}

export function AccountPageV4() {
  const [bagCount, setBagCount] = useState(readBag().length);
  const [drafts, setDrafts] = useState<StudioDraft[]>(readDrafts);
  const [localProjects, setLocalProjects] = useState<BeeProject[]>(readProjects);
  const [notes, setNotes] = useState<ProjectNote[]>(readProjectNotes);
  const [activeSection, setActiveSection] = useState<AccountSection>('Overview');
  const [selectedProjectId, setSelectedProjectId] = useState(() => readProjects()[0]?.id ?? customerProjects[1]?.id ?? customerProjects[0]?.id ?? '');
  const [proofDecision, setProofDecision] = useState<ProofDecision>('pending');
  const [reorderMessage, setReorderMessage] = useState('');
  const [noteDraft, setNoteDraft] = useState('');

  const projects = useMemo<WorkspaceProject[]>(() => [...localProjects.map(normalizeLocal), ...customerProjects.map(normalizeDemo)], [localProjects]);
  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0];
  const activeNotes = useMemo(() => notes.filter((note) => note.projectId === selectedProjectId), [notes, selectedProjectId]);
  const approvalCount = projects.filter((project) => project.stage === 'Proof').length;

  function syncBrowserState() {
    setBagCount(readBag().length);
    setDrafts(readDrafts());
    setLocalProjects(readProjects());
    setNotes(readProjectNotes());
  }

  useEffect(() => {
    window.addEventListener(CART_EVENT, syncBrowserState);
    window.addEventListener(PROJECT_EVENT, syncBrowserState);
    window.addEventListener('storage', syncBrowserState);
    window.addEventListener('focus', syncBrowserState);
    return () => {
      window.removeEventListener(CART_EVENT, syncBrowserState);
      window.removeEventListener(PROJECT_EVENT, syncBrowserState);
      window.removeEventListener('storage', syncBrowserState);
      window.removeEventListener('focus', syncBrowserState);
    };
  }, []);

  function openProject(id: string) { setSelectedProjectId(id); setActiveSection('Projects'); }

  function startReorder(productSlug: string) {
    const product = findStoreProduct(productSlug); if (!product) return;
    const current = readBag();
    const item: ProjectBagItem = { id: `reorder-${product.slug}-${Date.now()}`, productSlug: product.slug, color: product.colors[0] ?? '', size: product.sizes[0] ?? '', quantity: 12, decoration: product.decoration };
    saveBag([...current, item]); setReorderMessage(`${product.name} was added to the project bag as a reorder starting point.`);
  }

  function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selectedProjectId || !noteDraft.trim()) return;
    saveProjectNote(selectedProjectId, noteDraft); setNoteDraft(''); syncBrowserState();
  }

  function duplicateDraft(id: string) { duplicateStudioDraft(id); syncBrowserState(); }
  function deleteDraft(id: string) { deleteStudioDraft(id); syncBrowserState(); }
  function renameDraft(id: string, name: string) { renameStudioDraft(id, name); syncBrowserState(); }

  const sections: AccountSection[] = ['Overview', 'Projects', 'Quotes', 'Proofs', 'Payments', 'Designs', 'Reorders', 'Messages'];
  const newestLocal = localProjects[0];

  return <section className="account-workspace-v4">
    <header className="account-workspace-v3__topbar"><div><span className="eyebrow">Customer workspace</span><h1>Your projects, approvals, and saved work.</h1><p>Projects, Studio drafts, the bag, and notes now share the same browser-local workflow. Sample quote/proof states remain clearly marked as interface examples.</p></div><div><a className="button" href="/studio">New design</a><a href="/cart">Project bag {bagCount > 0 ? `(${bagCount})` : ''}</a></div></header>

    <div className="account-workspace-v3__layout">
      <aside className="account-nav-v3" aria-label="Customer workspace sections"><div>{sections.map((section) => <button key={section} type="button" aria-pressed={activeSection === section} className={activeSection === section ? 'is-active' : undefined} onClick={() => setActiveSection(section)}>{section}</button>)}</div><small>{localProjects.length} browser project{localProjects.length === 1 ? '' : 's'} · sample workflow states below</small></aside>

      <div className="account-content-v3">
        {activeSection === 'Overview' && <div className="account-tab-v3">
          <div className="attention-strip attention-strip--four"><article className="is-priority"><span>{newestLocal ? 'Newest request' : 'Needs approval'}</span><strong>{newestLocal ? newestLocal.reference : approvalCount}</strong>{newestLocal ? <button type="button" onClick={() => openProject(newestLocal.id)}>Open project →</button> : <button type="button" onClick={() => setActiveSection('Proofs')}>Review proof →</button>}</article><article><span>Project bag</span><strong>{bagCount}</strong><a href="/cart">Open bag →</a></article><article><span>Saved drafts</span><strong>{drafts.length}</strong><button type="button" onClick={() => setActiveSection('Designs')}>View drafts →</button></article><article><span>Browser projects</span><strong>{localProjects.length}</strong><button type="button" onClick={() => setActiveSection('Projects')}>View projects →</button></article></div>

          <section className="workspace-section"><header><span className="eyebrow">Next action</span><h2>{newestLocal ? `${newestLocal.reference} is ready for BEE review.` : 'Review the sample hoodie proof.'}</h2></header><div className="next-action-card"><div><strong>{newestLocal ? newestLocal.status : 'Sample approval state'}</strong><p>{newestLocal ? 'Your submitted project is now preserved with its designs and project details.' : 'Use the proof tab to test the approval and revision interaction.'}</p></div><button className="button" type="button" onClick={() => newestLocal ? openProject(newestLocal.id) : setActiveSection('Proofs')}>{newestLocal ? 'Open project' : 'Review sample proof'}</button></div></section>

          <section className="workspace-quick-actions" aria-label="Quick actions"><a href="/studio"><span>Design</span><strong>New custom piece</strong></a><a href="/start-order?type=bulk"><span>Group order</span><strong>Start a bulk request</strong></a><a href="/group-collector"><span>Roster</span><strong>Open Group Collector</strong></a><button type="button" onClick={() => setActiveSection('Messages')}><span>Project notes</span><strong>Save a note</strong></button></section>

          <section className="workspace-section"><header><span className="eyebrow">Projects</span><h2>Browser projects first. Interface examples second.</h2></header><div className="compact-project-list">{projects.slice(0, 6).map((project) => <button key={project.id} type="button" onClick={() => openProject(project.id)}><span>{project.isLocal ? project.label : `${project.stage} · sample`}</span><strong>{project.title}</strong><small>{project.status}</small><i><b style={{ width: `${project.progress}%` }} /></i></button>)}</div></section>
        </div>}

        {activeSection === 'Projects' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Projects</span><h2>One timeline from request to delivery.</h2></div></div><div className="project-workspace-v3"><div className="project-selector-v3">{projects.map((project) => <button type="button" key={project.id} className={selectedProject?.id === project.id ? 'is-active' : undefined} onClick={() => setSelectedProjectId(project.id)}><span>{project.isLocal ? project.label : `${project.stage} · sample`}</span><strong>{project.title}</strong><small>{project.status}</small></button>)}</div>{selectedProject && <article className="project-detail-v3"><header><div><span>{selectedProject.label}</span><h2>{selectedProject.title}</h2></div><b>{selectedProject.status}</b></header><div className="project-next-v3"><span>Next step</span><strong>{selectedProject.nextAction}</strong></div><ProjectTimeline project={selectedProject} />{selectedProject.isLocal && <div className="local-project-meta"><span>Saved in this browser</span><a href="/studio">Add another design →</a></div>}</article>}</div></div>}

        {activeSection === 'Quotes' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Quotes</span><h2>Requests waiting on pricing live here.</h2></div></div><div className="workspace-state-grid">{localProjects.map((project) => <article key={project.id}><span>{project.reference}</span><strong>{project.stage === 'Request' ? 'Waiting for BEE review' : project.status}</strong><dl><div><dt>Project</dt><dd>{project.title}</dd></div><div><dt>Quantity</dt><dd>{project.intake.quantity || project.items.reduce((sum, item) => sum + item.quantity, 0) || 'Not final'}</dd></div><div><dt>Pricing</dt><dd>Not prepared</dd></div></dl><button type="button" onClick={() => openProject(project.id)}>Open project →</button></article>)}<article><span>Interface example</span><strong>Quote stage</strong><p>A real backend quote will attach garments, decoration, price versions, expiration, and approval to the project record.</p></article></div></div>}

        {activeSection === 'Proofs' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Proofs</span><h2>Review placement before production.</h2></div><span className="demo-chip">Interface example</span></div><div className="proof-workspace-v3"><div className="proof-canvas-v3"><span>SAMPLE PROOF</span><div>ARTWORK</div><small>Development approval interface</small></div><div className="proof-copy-v3"><span>{proofPreview.version}</span><h3>{proofPreview.title}</h3><dl><div><dt>Placement</dt><dd>{proofPreview.placement}</dd></div><div><dt>Garment</dt><dd>{proofPreview.garment}</dd></div></dl><label>Revision note<textarea rows={4} placeholder="What needs to change?" /></label><div><button className="button" type="button" onClick={() => setProofDecision('approved')}>Approve sample proof</button><button type="button" onClick={() => setProofDecision('changes')}>Request changes</button></div>{proofDecision !== 'pending' && <div className="proof-decision-v3" role="status"><strong>{proofDecision === 'approved' ? 'Sample approval selected.' : 'Sample revision selected.'}</strong><span>No instruction was transmitted.</span><button type="button" onClick={() => setProofDecision('pending')}>Reset</button></div>}</div></div></div>}

        {activeSection === 'Payments' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Payments</span><h2>No payment is due in this browser prototype.</h2></div></div><div className="payment-roadmap"><div><span>01</span><strong>Quote approved</strong><p>The real project can expose its deposit requirement here.</p></div><div><span>02</span><strong>Deposit recorded</strong><p>Receipt and project status stay linked to the order.</p></div><div><span>03</span><strong>Balance settled</strong><p>Final payment state appears before release or fulfillment when required.</p></div></div></div>}

        {activeSection === 'Designs' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Designs & files</span><h2>Saved Studio work stays editable.</h2></div><a className="text-link" href="/studio">Create another design →</a></div><section className="browser-drafts"><header><strong>Browser Studio drafts</strong><span>{drafts.length}</span></header>{drafts.length === 0 ? <p>No Studio drafts saved in this browser yet.</p> : <div>{drafts.slice().reverse().map((draft) => <article key={draft.id} className="browser-draft-card"><span>{draft.decoration === 'embroidery' ? 'Embroidery' : 'Graphic / print'}</span><input aria-label={`Rename ${draft.name}`} defaultValue={draft.name} onBlur={(event) => renameDraft(draft.id, event.target.value)} /><small>{draft.garment} · {draft.size} · {draft.quantity} piece{draft.quantity === 1 ? '' : 's'}</small><div><a href={`/studio?draft=${encodeURIComponent(draft.id)}`}>Open →</a><button type="button" onClick={() => duplicateDraft(draft.id)}>Duplicate</button><button type="button" onClick={() => deleteDraft(draft.id)}>Delete</button></div></article>)}</div>}</section><div className="design-file-grid">{savedDesigns.map((asset, index) => <article key={asset.name}><div><span>SAMPLE</span><b>{String(index + 1).padStart(2, '0')}</b></div><small>{asset.type}</small><h3>{asset.name}</h3><p>{asset.use}</p><span>{asset.status}</span></article>)}</div></div>}

        {activeSection === 'Reorders' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Reorders</span><h2>Start from an approved setup.</h2></div></div>{reorderMessage && <div className="reorder-message" role="status">{reorderMessage}<a href="/cart">Open bag →</a></div>}<div className="reorder-grid-v3">{reorderStartingPoints.map((item) => <article key={item.title}><span>Sample starting point</span><h3>{item.title}</h3><p>{item.detail}</p><small>{item.note}</small><button type="button" onClick={() => startReorder(item.productSlug)}>Build from this →</button></article>)}</div></div>}

        {activeSection === 'Messages' && <div className="account-tab-v3"><div className="workspace-section-heading"><div><span className="eyebrow">Project notes</span><h2>Keep context with the project.</h2></div><span className="demo-chip">Browser only</span></div><div className="message-workspace-v4"><aside>{projects.map((project) => <button key={project.id} type="button" className={selectedProjectId === project.id ? 'is-active' : undefined} onClick={() => setSelectedProjectId(project.id)}><strong>{project.title}</strong><small>{project.isLocal ? project.label : `${project.status} · sample`}</small></button>)}</aside><section><header><strong>{selectedProject?.title ?? 'Project'}</strong><span>{activeNotes.length} saved note{activeNotes.length === 1 ? '' : 's'}</span></header><div className="message-thread-v4">{activeNotes.length === 0 ? <p>No browser notes saved for this project.</p> : activeNotes.map((note) => <article key={note.id}><p>{note.body}</p><small>{new Date(note.createdAt).toLocaleString()}</small></article>)}</div><form onSubmit={saveNote}><label>Save a project note<textarea rows={4} value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Example: Ask about switching the sleeve placement before the next proof." /></label><button className="button" type="submit">Save note</button><small>This note stays in this browser and is attached to the selected project.</small></form></section></div></div>}
      </div>
    </div>
  </section>;
}
