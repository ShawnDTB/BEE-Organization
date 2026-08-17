import { useMemo, useState, type FormEvent } from 'react';
import {
  createProject,
  readBag,
  readProjectDraft,
  saveProjectDraft,
  type BeeProject,
  type IntakeType,
  type ProjectIntake,
} from '../data/projectStore';

function requestedType(): IntakeType {
  const value = new URLSearchParams(window.location.search).get('type');
  return value === 'bulk' || value === 'creator' || value === 'unsure' ? value : 'custom';
}

export function StartOrderPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ProjectIntake>(() => {
    const saved = readProjectDraft();
    const requested = requestedType();
    const shouldUseRequested = new URLSearchParams(window.location.search).has('type');
    return shouldUseRequested ? { ...saved, type: requested } : saved;
  });
  const [submitted, setSubmitted] = useState<BeeProject | null>(null);

  const summary = useMemo(() => [
    ['Project', data.type], ['Garment', data.garment || 'Not decided'], ['Quantity', data.quantity || 'Not decided'], ['Artwork', data.artwork || 'Not decided'], ['Deadline', data.deadline || 'Not provided'], ['Fulfillment', data.fulfillment || 'Not decided'], ['Personalization', data.personalization || 'None noted'], ['Contact', data.name], ['Organization / brand', data.organization || 'Not provided'], ['Email', data.email], ['Phone', data.phone || 'Not provided'], ['Notes', data.notes || 'None'],
  ], [data]);

  function update<K extends keyof ProjectIntake>(key: K, value: ProjectIntake[K]) {
    const next = { ...data, [key]: value };
    setData(next);
    saveProjectDraft({ [key]: value });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(createProject(data, readBag()));
  }

  if (submitted) {
    return <section className="intake-page"><div className="intake-summary intake-summary--submitted"><span className="eyebrow">Request saved</span><h1>{submitted.reference}</h1><p>The request is now part of this browser's Customer Workspace. No payment or production action was triggered.</p><dl>{summary.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className="intake-nav"><a className="button" href="/account">Open customer workspace</a><a className="text-link" href="/studio">Start another design →</a></div></div></section>;
  }

  return <section className="intake-page">
    <header className="intake-heading"><div><span className="eyebrow">Start a project</span><h1>Tell BEE what you know.</h1></div><p>Your progress stays in this browser, so you can move between intake, Studio, the project bag, and review without retyping the same project details.</p></header>

    <div className="intake-progress" aria-label={`Step ${step} of 4`}>{[1, 2, 3, 4].map((number) => <button key={number} type="button" className={step === number ? 'is-active' : step > number ? 'is-complete' : undefined} onClick={() => setStep(number)}><span>{number}</span><b>{['Project', 'Details', 'Timing', 'Contact'][number - 1]}</b></button>)}</div>

    <form className="intake-form" onSubmit={submit}>
      {step === 1 && <fieldset><legend>What are you making?</legend><div className="intake-choice-grid">{([['custom', 'Custom apparel', 'A piece or small project.'], ['bulk', 'Group / bulk order', 'A coordinated team, school, business, organization, or event order.'], ['creator', 'Creator merchandise', 'A drop, restock, or creator collection.'], ['unsure', 'Not sure yet', 'Start with the goal and let review determine the path.']] as const).map(([value, title, copy]) => <button type="button" key={value} className={data.type === value ? 'is-active' : undefined} onClick={() => update('type', value)}><strong>{title}</strong><span>{copy}</span></button>)}</div><button className="button intake-next" type="button" onClick={() => setStep(2)}>Continue to details</button></fieldset>}

      {step === 2 && <fieldset><legend>What do you already know?</legend><div className="intake-fields"><label>Garment or item<input value={data.garment} onChange={(e) => update('garment', e.target.value)} placeholder="Example: black hoodies and tees" /></label><label>Estimated quantity<input value={data.quantity} onChange={(e) => update('quantity', e.target.value)} placeholder="Example: 24–36 pieces" /></label><label className="intake-wide">Artwork status<select value={data.artwork} onChange={(e) => update('artwork', e.target.value)}><option value="">Choose one</option><option>Production-ready artwork available</option><option>Artwork exists but needs review</option><option>Concept or sketch only</option><option>Design help needed</option></select></label></div><div className="intake-nav"><button type="button" onClick={() => setStep(1)}>Back</button><a className="text-link" href="/studio">Add a design in Studio →</a><button className="button" type="button" onClick={() => setStep(3)}>Continue</button></div></fieldset>}

      {step === 3 && <fieldset><legend>When and how does it need to happen?</legend><div className="intake-fields"><label>Need-by date<input type="date" value={data.deadline} onChange={(e) => update('deadline', e.target.value)} /></label><label>Fulfillment<select value={data.fulfillment} onChange={(e) => update('fulfillment', e.target.value)}><option value="">Not decided</option><option>Pickup</option><option>Bulk delivery</option><option>Shipping</option><option>Individual fulfillment may be needed</option></select></label><label className="intake-wide">Personalization / roster needs<input value={data.personalization} onChange={(e) => update('personalization', e.target.value)} placeholder="Names, numbers, departments, size collection, or none" /></label></div><div className="intake-nav"><button type="button" onClick={() => setStep(2)}>Back</button><button className="button" type="button" onClick={() => setStep(4)}>Continue</button></div></fieldset>}

      {step === 4 && <fieldset><legend>Who should BEE contact?</legend><div className="intake-fields"><label>Name<input required value={data.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" /></label><label>Organization / brand<input value={data.organization} onChange={(e) => update('organization', e.target.value)} autoComplete="organization" /></label><label>Email<input required type="email" value={data.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" /></label><label>Phone<input type="tel" value={data.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" /></label><label className="intake-wide">Anything else?<textarea rows={5} value={data.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Sizes, colors, event context, placements, or questions." /></label></div><div className="intake-nav"><button type="button" onClick={() => setStep(3)}>Back</button><a className="text-link" href="/project-review">Review with project bag →</a><button className="button" type="submit">Create browser project</button></div></fieldset>}
    </form>
  </section>;
}
