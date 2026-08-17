import { useMemo, useState, type FormEvent } from 'react';

type Participant = {
  id: string;
  name: string;
  item: string;
  size: string;
  personalization: string;
};

const sizes = ['Youth S', 'Youth M', 'Youth L', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const items = ['T-shirt', 'Hoodie', 'Polo'];

export function GroupCollectorPage() {
  const [target, setTarget] = useState(12);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [name, setName] = useState('');
  const [item, setItem] = useState(items[0] ?? 'T-shirt');
  const [size, setSize] = useState('M');
  const [personalization, setPersonalization] = useState('');

  const completion = useMemo(() => Math.min(100, Math.round((participants.length / Math.max(1, target)) * 100)), [participants.length, target]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setParticipants((current) => [...current, { id: `${Date.now()}`, name: name.trim(), item, size, personalization: personalization.trim() }]);
    setName('');
    setPersonalization('');
  }

  function remove(id: string) {
    setParticipants((current) => current.filter((participant) => participant.id !== id));
  }

  return (
    <section className="collector-page">
      <header className="workspace-heading collector-heading">
        <div><span className="eyebrow">Group Collector · prototype</span><h1>One link for the sizes the organizer normally has to chase down.</h1></div>
        <p>This demo stays in your browser. The production version will connect participants to a real organization project.</p>
      </header>

      <div className="collector-layout">
        <section className="collector-project">
          <div className="collector-project__top">
            <div><span>Demo group project</span><h2>Team apparel roster</h2></div>
            <label>Expected people<input type="number" min="1" max="500" value={target} onChange={(event) => setTarget(Math.max(1, Number(event.target.value)))} /></label>
          </div>
          <div className="collector-progress"><div><strong>{participants.length} / {target}</strong><span>{completion}% complete</span></div><i><b style={{ width: `${completion}%` }} /></i></div>

          <div className="collector-roster">
            {participants.length === 0 ? <div className="collector-empty"><span>No responses yet</span><p>Add a participant below to see how the shared roster behaves.</p></div> : participants.map((participant, index) => (
              <article key={participant.id}>
                <b>{String(index + 1).padStart(2, '0')}</b>
                <div><strong>{participant.name}</strong><span>{participant.item} · {participant.size}{participant.personalization ? ` · ${participant.personalization}` : ''}</span></div>
                <button type="button" onClick={() => remove(participant.id)}>Remove</button>
              </article>
            ))}
          </div>
        </section>

        <aside className="collector-entry">
          <span className="eyebrow">Participant response</span>
          <h2>Add your details.</h2>
          <form onSubmit={submit}>
            <label>Name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Participant name" /></label>
            <label>Item<select value={item} onChange={(event) => setItem(event.target.value)}>{items.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label>Size<select value={size} onChange={(event) => setSize(event.target.value)}>{sizes.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label>Personalization<input value={personalization} onChange={(event) => setPersonalization(event.target.value)} placeholder="Name / number / department (optional)" /></label>
            <button className="button" type="submit">Add response</button>
          </form>
          <p>Production will add secure share links, project-specific garment choices, deadlines, duplicate prevention, organizer controls, and optional payment/fulfillment fields.</p>
        </aside>
      </div>

      <section className="collector-value">
        <div><span>Organizer</span><strong>Share one link.</strong><p>Stop rebuilding a roster from texts, DMs, and screenshots.</p></div>
        <div><span>Participant</span><strong>Submit your own details.</strong><p>The person wearing the apparel owns their size and personalization entry.</p></div>
        <div><span>BEE</span><strong>Receive structured production data.</strong><p>Approved roster information can flow directly into the order instead of being retyped.</p></div>
      </section>

      <div className="collector-actions"><a className="button" href="/start-order?type=bulk">Start a real group request</a><a className="text-link" href="/bulk-orders">Back to bulk & organizations →</a></div>
    </section>
  );
}
