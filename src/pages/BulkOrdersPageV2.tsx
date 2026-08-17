const groupFaqs = [
  ['Do I need exact sizes before asking for a quote?', 'No. A rough headcount is enough to start. Final quantities and sizes can be confirmed before production.'],
  ['Can people submit their own sizes?', 'Yes. The Group Collector prototype shows the intended workflow for collecting participant details through one shared roster.'],
  ['Can the same design be reordered later?', 'Yes. Reorders can start from the approved project while current garment availability and pricing are reconfirmed.'],
  ['Can names or numbers be personalized?', 'They can be planned as part of the project when the garment and decoration method support it.'],
] as const;

export function BulkOrdersPageV2() {
  return (
    <>
      <section className="compact-hero">
        <div className="compact-hero__copy">
          <span className="eyebrow">Bulk & organizations</span>
          <h1>One apparel project. Everyone accounted for.</h1>
          <p>For teams, schools, businesses, events, and organizations that need clear quantities, sizes, personalization, approvals, and reorders.</p>
          <div className="compact-hero__actions">
            <a className="button" href="/start-order?type=bulk">Get a bulk quote</a>
            <a className="text-link" href="/group-collector">Try the Group Collector →</a>
          </div>
        </div>
      </section>

      <section className="order-mode-grid">
        <article>
          <span>01</span>
          <h2>One organizer</h2>
          <p>You already know what everyone needs. BEE works from one size list, one approval path, and one invoice.</p>
          <small>Best for staff apparel, controlled team orders, and event runs.</small>
        </article>
        <article>
          <span>02</span>
          <h2>Shared size collector</h2>
          <p>Participants enter their own size and personalization details so the organizer does not rebuild a roster by hand.</p>
          <a className="text-link" href="/group-collector">Open the prototype →</a>
        </article>
        <article>
          <span>03</span>
          <h2>Dedicated storefront</h2>
          <p>Approved merchandise can eventually stay available through a focused store or order window for repeat customers.</p>
          <small>Best for recurring programs and self-service ordering.</small>
        </article>
      </section>

      <section className="group-feature">
        <div>
          <span className="eyebrow">Group Collector</span>
          <h2>Stop chasing sizes through texts.</h2>
          <p>Set the expected headcount, share one roster, and let each participant submit the details that belong to them.</p>
          <a className="button" href="/group-collector">Try the browser prototype</a>
        </div>
        <div className="group-collector-demo" aria-label="Group collector interface concept">
          <div><strong>Team apparel</strong><span>18 / 24 responses</span></div>
          <i><b style={{ width: '75%' }} /></i>
          <ul>
            <li><span>Jordan M.</span><b>XL · submitted</b></li>
            <li><span>Taylor R.</span><b>M · submitted</b></li>
            <li><span>6 remaining</span><b>Awaiting response</b></li>
          </ul>
        </div>
      </section>

      <section className="faq-split">
        <div><span className="eyebrow">Before you start</span><h2>The questions that actually hold up a group order.</h2></div>
        <div className="faq-list faq-list--compact">
          {groupFaqs.map(([question, answer]) => (
            <details key={question}><summary>{question}</summary><p>{answer}</p></details>
          ))}
        </div>
      </section>

      <section className="action-band">
        <div><h2>A rough headcount is enough.</h2><p>Garment, artwork, final sizes, and timing can be organized from there.</p></div>
        <div><a className="button" href="/start-order?type=bulk">Start the bulk request</a><a className="text-link" href="/studio">Design the garment →</a></div>
      </section>
    </>
  );
}
