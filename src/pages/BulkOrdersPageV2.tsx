const groupFaqs = [
  [
    "Do I need exact sizes before asking for a quote?",
    "No. A rough headcount is enough to start. Final quantities and sizes can be confirmed before production.",
  ],
  [
    "Can people submit their own sizes?",
    "For now, send a size list with your request. A shared participant collector is planned; the current demo only works on one device.",
  ],
  [
    "Can we reorder the same design later?",
    "Yes. The approved project can be reused as the starting point while current garment availability and pricing are reconfirmed.",
  ],
  [
    "Can we add names or numbers?",
    "Yes when the garment and decoration method support it. Add the personalization requirement to the project so it is planned from the start.",
  ],
] as const;

export function BulkOrdersPageV2() {
  return (
    <>
      <section className="compact-hero">
        <div className="compact-hero__copy">
          <span className="eyebrow">Bulk & organizations</span>
          <h1>Bring your people together.</h1>
          <p>
            Tell us roughly how many people, what you are making, and when you
            need it. Plan garments, size breakdowns, and personalization in one
            clear request.
          </p>
          <div className="compact-hero__actions">
            <a className="button" href="/start-order?type=bulk">
              Get a bulk quote
            </a>
            <a className="text-link" href="/group-collector">
              Try the Group Collector →
            </a>
          </div>
        </div>
      </section>

      <section
        className="order-mode-grid"
        aria-label="Ways to organize a group order"
      >
        <article>
          <span>01</span>
          <h2>One organizer</h2>
          <p>
            Send one size list. One person approves the design and quote for the
            group.
          </p>
          <small>Best when you already have the roster.</small>
        </article>
        <article>
          <span>02</span>
          <h2>Shared size collector</h2>
          <p>
            Shared participant links are planned. Today, add a size breakdown to
            your request.
          </p>
          <a className="text-link" href="/group-collector">
            Open the prototype →
          </a>
        </article>
        <article>
          <span>03</span>
          <h2>Repeat program</h2>
          <p>
            Keep the approved design and order setup ready for the next run.
          </p>
          <small>
            Storefront options can be added later when a program needs
            self-service ordering.
          </small>
        </article>
      </section>

      <section className="group-feature">
        <div>
          <span className="eyebrow">Group Collector</span>
          <h2>A simpler roster is on the way.</h2>
          <p>
            Explore the local demonstration. Responses stay in the same browser;
            this is not a shareable live group order.
          </p>
          <a className="button" href="/group-collector">
            Try the browser prototype
          </a>
        </div>
        <div
          className="group-collector-demo"
          aria-label="Group collector interface preview"
        >
          <div>
            <strong>Team apparel</strong>
            <span>18 / 24 responses</span>
          </div>
          <i>
            <b style={{ width: "75%" }} />
          </i>
          <ul>
            <li>
              <span>Jordan M.</span>
              <b>XL · submitted</b>
            </li>
            <li>
              <span>Taylor R.</span>
              <b>M · submitted</b>
            </li>
            <li>
              <span>6 remaining</span>
              <b>Awaiting response</b>
            </li>
          </ul>
        </div>
      </section>

      <section className="faq-split">
        <div>
          <span className="eyebrow">Group order FAQ</span>
          <h2>Questions before you start.</h2>
        </div>
        <div className="faq-list faq-list--compact">
          {groupFaqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="action-band">
        <div>
          <h2>Ready to price the order?</h2>
          <p>A rough headcount is enough to start.</p>
        </div>
        <div>
          <a className="button" href="/start-order?type=bulk">
            Start the bulk request
          </a>
          <a className="text-link" href="/studio">
            Design the garment →
          </a>
        </div>
      </section>
    </>
  );
}
