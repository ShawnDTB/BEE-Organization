import { useMemo, useState, type FormEvent } from 'react';
import { readCollector, saveCollector, type CollectorParticipant } from '../data/projectStore';

const sizes = ['Youth S', 'Youth M', 'Youth L', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const items = ['T-shirt', 'Hoodie', 'Polo'];

function participantMode() {
  return new URLSearchParams(window.location.search).get('view') === 'participant';
}

function sizeSummary(participants: CollectorParticipant[]) {
  return participants.reduce<Record<string, number>>((totals, participant) => {
    totals[participant.size] = (totals[participant.size] ?? 0) + 1;
    return totals;
  }, {});
}

export function GroupCollectorPage() {
  const [mode, setMode] = useState<'organizer' | 'participant'>(participantMode() ? 'participant' : 'organizer');
  const initial = useMemo(readCollector, []);
  const [target, setTarget] = useState(initial.target);
  const [participants, setParticipants] = useState(initial.participants);
  const [name, setName] = useState('');
  const [item, setItem] = useState(items[0] ?? 'T-shirt');
  const [size, setSize] = useState('M');
  const [personalization, setPersonalization] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const completion = useMemo(() => Math.min(100, Math.round((participants.length / Math.max(1, target)) * 100)), [participants.length, target]);
  const totals = useMemo(() => sizeSummary(participants), [participants]);

  function persist(nextTarget: number, nextParticipants: CollectorParticipant[]) {
    setTarget(nextTarget); setParticipants(nextParticipants);
    saveCollector({ target: nextTarget, participants: nextParticipants, updatedAt: new Date().toISOString() });
  }

  function submit(event: FormEvent) {
    event.preventDefault(); if (!name.trim()) return;
    const participant: CollectorParticipant = { id: `participant-${Date.now()}`, name: name.trim(), item, size, personalization: personalization.trim(), createdAt: new Date().toISOString() };
    persist(target, [...participants, participant]); setName(''); setPersonalization(''); setSubmitted(true);
  }

  function remove(id: string) { persist(target, participants.filter((participant) => participant.id !== id)); }
  function changeTarget(value: number) { persist(Math.max(1, value), participants); }

  if (mode === 'participant') {
    return <section className="collector-page collector-page--participant">
      <header className="workspace-heading collector-heading"><div><span className="eyebrow">Group Collector</span><h1>Submit your apparel details.</h1></div><p>This participant view only asks for the information needed for your own entry. It does not expose the organizer roster.</p></header>
      <div className="collector-participant-card">
        {submitted ? <div className="collector-success" role="status"><span>Response saved</span><h2>Your details were added to this browser roster.</h2><p>The production version will use a secure project-specific link and duplicate protection.</p><button className="button" type="button" onClick={() => setSubmitted(false)}>Add another demo response</button></div> : <form onSubmit={submit}><label>Name<input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label><label>Item<select value={item} onChange={(event) => setItem(event.target.value)}>{items.map((option) => <option key={option}>{option}</option>)}</select></label><label>Size<select value={size} onChange={(event) => setSize(event.target.value)}>{sizes.map((option) => <option key={option}>{option}</option>)}</select></label><label>Personalization<input value={personalization} onChange={(event) => setPersonalization(event.target.value)} placeholder="Name / number / department (optional)" /></label><button className="button" type="submit">Submit response</button></form>}
        <button className="collector-mode-link" type="button" onClick={() => setMode('organizer')}>Open organizer demo →</button>
      </div>
    </section>;
  }

  return <section className="collector-page">
    <header className="workspace-heading collector-heading"><div><span className="eyebrow">Group Collector · organizer</span><h1>See the roster without rebuilding it by hand.</h1></div><p>Set the headcount, share the participant view, review missing responses, and check the size mix.</p></header>

    <div className="collector-layout">
      <section className="collector-project">
        <div className="collector-project__top"><div><span>Browser group project</span><h2>Team apparel roster</h2></div><label>Expected people<input type="number" min="1" max="500" value={target} onChange={(event) => changeTarget(Number(event.target.value))} /></label></div>
        <div className="collector-progress"><div><strong>{participants.length} / {target}</strong><span>{completion}% complete</span></div><i><b style={{ width: `${completion}%` }} /></i></div>
        <div className="collector-organizer-tools"><div><span>Participant link</span><code>/group-collector?view=participant</code></div><a className="button" href="/group-collector?view=participant">Open participant view</a></div>

        <div className="collector-roster">{participants.length === 0 ? <div className="collector-empty"><span>No responses yet</span><p>Open the participant view and submit a response to populate this roster.</p></div> : participants.map((participant, index) => <article key={participant.id}><b>{String(index + 1).padStart(2, '0')}</b><div><strong>{participant.name}</strong><span>{participant.item} · {participant.size}{participant.personalization ? ` · ${participant.personalization}` : ''}</span></div><button type="button" onClick={() => remove(participant.id)}>Remove</button></article>)}</div>
      </section>

      <aside className="collector-entry collector-entry--organizer"><span className="eyebrow">Organizer summary</span><h2>{Math.max(0, target - participants.length)} response{Math.max(0, target - participants.length) === 1 ? '' : 's'} remaining.</h2><div className="collector-size-summary">{Object.keys(totals).length === 0 ? <p>Size totals appear after responses are submitted.</p> : Object.entries(totals).sort(([a], [b]) => a.localeCompare(b)).map(([label, count]) => <div key={label}><span>{label}</span><strong>{count}</strong></div>)}</div><div className="collector-personalization-summary"><strong>Personalized entries</strong><span>{participants.filter((participant) => participant.personalization).length}</span></div><p>The production version will add secure share links, deadlines, organizer permissions, duplicate prevention, project-specific garment choices, and optional payment/fulfillment fields.</p></aside>
    </div>

    <section className="collector-value"><div><span>Organizer</span><strong>Share one link.</strong><p>See who has responded and what is still missing.</p></div><div><span>Participant</span><strong>Submit only your details.</strong><p>No access to the full organizer roster.</p></div><div><span>BEE</span><strong>Receive structured production data.</strong><p>Sizes and personalization can flow into the project instead of being retyped.</p></div></section>
    <div className="collector-actions"><a className="button" href="/start-order?type=bulk">Start a group request</a><a className="text-link" href="/bulk-orders">Back to bulk & organizations →</a></div>
  </section>;
}
