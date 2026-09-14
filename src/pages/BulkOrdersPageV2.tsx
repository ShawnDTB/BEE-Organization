const groupFaqs = [
  [
    "Do I need exact sizes before asking for a quote?",
    "No. A rough headcount is enough to start. Use the size planner when you are ready, and confirm final quantities before production.",
  ],
  [
    "Can people submit their own sizes?",
    "Not yet. The planner is for one organizer on one device. Shared participant links will be a separate service with private access.",
  ],
  [
    "Does the size planner place an order?",
    "No. It prepares a breakdown for your request. Pricing, garment availability, sizing, artwork and timing still need confirmation.",
  ],
  [
    "Can we add names or numbers?",
    "Describe the personalization you need in the request. Arrange the final list directly with BEE; do not put private participant information in public links.",
  ],
];
export function BulkOrdersPageV2() {
  return (
    <>
      <section className="compact-hero">
        <div className="compact-hero__copy">
          <span className="eyebrow">Groups & businesses</span>
          <h1>Bring your people together.</h1>
          <p>
            School spirit. A team uniform. A business showing up as one. Gather
            the headcount, garment direction, and details in a single brief.
          </p>
          <div className="compact-hero__actions">
            <a className="button" href="/start-order?type=bulk">
              Plan a group request ↗
            </a>
            <a className="text-link" href="/group-planner">
              Build a size breakdown →
            </a>
          </div>
        </div>
      </section>
      <section className="order-mode-grid" aria-label="Ways to begin">
        <article>
          <span>01 / Start simple</span>
          <h2>A rough headcount</h2>
          <p>
            Tell us what the group is for and about how many pieces you need.
            You do not have to settle every detail first.
          </p>
          <a className="text-link" href="/start-order?type=bulk">
            Start with what you know →
          </a>
        </article>
        <article>
          <span>02 / Get organized</span>
          <h2>A clear size plan</h2>
          <p>
            Total the requested sizes without entering participant names. Carry
            the breakdown into your request or download a copy.
          </p>
          <a className="text-link" href="/group-planner">
            Open the size planner →
          </a>
        </article>
        <article>
          <span>03 / Make it yours</span>
          <h2>A visual direction</h2>
          <p>
            Try text or artwork on a garment in Studio. It is an optional
            concept preview, not a production proof.
          </p>
          <a className="text-link" href="/studio">
            Explore the design →
          </a>
        </article>
      </section>
      <section className="group-feature">
        <div>
          <span className="eyebrow">Less chasing. Clearer planning.</span>
          <h2>The group order starts with you.</h2>
          <p>
            Keep the practical details together: sizes, color, artwork, timing
            and who is approving the project.
          </p>
          <a className="button" href="/group-planner">
            Plan the sizes ↗
          </a>
        </div>
        <div className="group-planning-checklist">
          <h3>Before production, confirm</h3>
          <ul>
            <li>The exact garment and available sizes</li>
            <li>Final counts and personalization spelling</li>
            <li>Artwork, placement and approved proof</li>
            <li>The quote, timing and fulfillment plan</li>
          </ul>
          <p>
            The planner saves locally. It does not collect responses from other
            devices or reserve stock.
          </p>
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
          <h2>One clear starting point.</h2>
          <p>Bring the people. We’ll work through what they’ll wear.</p>
        </div>
        <a className="button" href="/start-order?type=bulk">
          Prepare the project brief ↗
        </a>
      </section>
    </>
  );
}
