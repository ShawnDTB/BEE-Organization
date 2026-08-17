import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { faqs, orderSteps, siteConfig } from '../content/siteContent';

type HeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  media?: ReactNode;
};

function CompactHero({ eyebrow, title, description, primary, secondary, media }: HeroProps) {
  return (
    <section className={`compact-hero${media ? ' compact-hero--media' : ''}`}>
      <div className="compact-hero__copy">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{description}</p>
        {(primary || secondary) && (
          <div className="compact-hero__actions">
            {primary && <a className="button" href={primary.href}>{primary.label}</a>}
            {secondary && <a className="text-link" href={secondary.href}>{secondary.label} →</a>}
          </div>
        )}
      </div>
      {media && <div className="compact-hero__media">{media}</div>}
    </section>
  );
}

function ProcessRail() {
  return (
    <ol className="process-rail">
      {orderSteps.map(([number, title, description]) => (
        <li key={number}>
          <span>{number}</span>
          <div><strong>{title}</strong><p>{description}</p></div>
        </li>
      ))}
    </ol>
  );
}

function FaqList({ items = faqs }: { items?: readonly (readonly [string, string])[] }) {
  return (
    <div className="faq-list faq-list--compact">
      {items.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}

function ActionBand({ title, copy, primary, secondary }: { title: string; copy: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  return (
    <section className="action-band">
      <div><h2>{title}</h2><p>{copy}</p></div>
      <div>
        <a className="button" href={primary.href}>{primary.label}</a>
        {secondary && <a className="text-link" href={secondary.href}>{secondary.label} →</a>}
      </div>
    </section>
  );
}

const homePaths = [
  {
    kicker: 'Create custom',
    title: 'Design something for you.',
    copy: 'Start with a tee, hoodie, or polo and build the design visually before asking for production review.',
    href: '/studio',
    action: 'Open BEE Studio',
    art: '/store/tee.svg',
  },
  {
    kicker: 'Order for a group',
    title: 'Keep the people and sizes organized.',
    copy: 'Schools, teams, businesses, events, and organizations can start one coordinated project instead of a message thread.',
    href: '/bulk-orders',
    action: 'Plan a group order',
    art: '/store/polo.svg',
  },
  {
    kicker: 'Shop finished merch',
    title: 'Buy a collection that is ready.',
    copy: 'Creator drops, BEE originals, and organization storefronts belong here once the merchandise physically exists and is approved.',
    href: '/shop',
    action: 'Visit the shop',
    art: '/store/hoodie.svg',
  },
] as const;

export function HomePage() {
  return (
    <>
      <section className="home-hero-v3">
        <div className="home-hero-v3__copy">
          <span className="eyebrow">Custom apparel · built clearly</span>
          <h1>{siteConfig.primaryMessage}</h1>
          <p>{siteConfig.supportingMessage}</p>
          <div className="home-hero-v3__actions">
            <a className="button" href="/studio">Design custom apparel</a>
            <a href="/bulk-orders">Bulk & team orders</a>
            <a href="/shop">Shop collections</a>
          </div>
        </div>
        <div className="home-hero-v3__visual" aria-label="Custom apparel pathways">
          <div className="home-garment home-garment--primary"><img src="/store/hoodie.svg" alt="Heavyweight hoodie development visual" /></div>
          <div className="home-garment home-garment--secondary"><img src="/store/polo.svg" alt="Performance polo development visual" /></div>
          <div className="home-hero-v3__note"><span>Design</span><b>→</b><span>Approve</span><b>→</b><span>Produce</span><b>→</b><span>Reorder</span></div>
        </div>
      </section>

      <section className="intent-paths" aria-label="Choose how to start">
        {homePaths.map((path) => (
          <a key={path.kicker} href={path.href} className="intent-card">
            <div className="intent-card__visual"><img src={path.art} alt="" /></div>
            <div><span>{path.kicker}</span><h2>{path.title}</h2><p>{path.copy}</p><b>{path.action} →</b></div>
          </a>
        ))}
      </section>

      <section className="feature-story">
        <div className="feature-story__visual">
          <img src="/store/tee.svg" alt="Custom tee development visual" />
          <span>Studio preview</span>
        </div>
        <div className="feature-story__copy">
          <span className="eyebrow">Make it before you request it</span>
          <h2>Start with the garment. Build the idea visually.</h2>
          <p>BEE Studio lets you choose a garment, change its color, add text or artwork, select embroidery or graphic decoration, and position the design before the project moves into review.</p>
          <div><a className="button" href="/studio">Open Studio</a><a className="text-link" href="/embroidery">See embroidery options →</a></div>
        </div>
      </section>

      <section className="capability-mosaic">
        <a href="/embroidery" className="capability-tile capability-tile--wide">
          <div><span>Embroidery</span><h2>Texture, durability, and a cleaner branded finish.</h2><b>Explore embroidery →</b></div>
          <img src="/store/polo.svg" alt="Embroidered polo development visual" />
        </a>
        <a href="/graphic-apparel" className="capability-tile">
          <div><span>Graphic apparel</span><h2>Artwork-forward pieces.</h2><b>Explore graphics →</b></div>
          <img src="/store/tee.svg" alt="Graphic tee development visual" />
        </a>
        <a href="/bulk-orders" className="capability-tile">
          <div><span>Teams & staff</span><h2>Repeatable group systems.</h2><b>Plan a program →</b></div>
          <img src="/store/layer.svg" alt="Organization layer development visual" />
        </a>
      </section>

      <section className="sample-lab-teaser">
        <div>
          <span className="eyebrow">Sample Lab</span>
          <h2>Proof comes from what the machines actually produce.</h2>
        </div>
        <p>As BEE completes its own stitch tests, graphic tests, wash checks, and finished samples, those real results will replace development visuals across the site. Nothing will be presented as customer work before it is.</p>
        <a className="text-link" href="/our-work">See the Sample Lab plan →</a>
      </section>

      <section className="home-process">
        <div><span className="eyebrow">Four clear checkpoints</span><h2>Custom should feel organized, not complicated.</h2></div>
        <ProcessRail />
      </section>

      <ActionBand
        title="Know what you want—or only know that you need apparel?"
        copy="Both are enough to start. Build it visually or send the details you already have."
        primary={{ label: 'Start a project', href: '/start-order' }}
        secondary={{ label: 'Design in Studio', href: '/studio' }}
      />
    </>
  );
}

export function BulkOrdersPage() {
  return (
    <>
      <CompactHero
        eyebrow="Bulk & organizations"
        title="Ordering for a team, school, business, event, or group?"
        description="Choose the ordering structure that fits how your people actually need to participate."
        primary={{ label: 'Get a bulk quote', href: '/start-order?type=bulk' }}
        secondary={{ label: 'Design the garment', href: '/studio' }}
      />

      <section className="order-mode-grid">
        <article><span>01</span><h2>One organizer</h2><p>One decision maker, one coordinated size list, one quote, and one bulk invoice.</p><small>Best when the organizer already controls quantities and distribution.</small></article>
        <article><span>02</span><h2>Shared size collector</h2><p>Participants submit their own size and personalization through one shared project link.</p><small>Planned platform feature for teams, schools, departments, and events.</small></article>
        <article><span>03</span><h2>Dedicated storefront</h2><p>An approved collection stays available through a focused organization store or order window.</p><small>Best for repeat programs and customers ordering for themselves.</small></article>
      </section>

      <section className="bulk-quote-strip">
        <div><span>Garment</span><p>Style, color, size range, and availability.</p></div>
        <div><span>Quantity</span><p>Estimated pieces and personalization.</p></div>
        <div><span>Artwork</span><p>Logo, design, placement, and decoration.</p></div>
        <div><span>Timing</span><p>Approval date, need-by date, and fulfillment.</p></div>
      </section>

      <section className="group-feature">
        <div>
          <span className="eyebrow">Group Collector · planned</span>
          <h2>Stop collecting sizes in texts and spreadsheets.</h2>
          <p>An organizer will be able to approve a design, share one link, and watch the roster fill in as participants submit sizes, names, numbers, and other enabled details.</p>
          <a className="text-link" href="/start-order?type=bulk">Start with a standard group request →</a>
        </div>
        <div className="group-collector-demo" aria-label="Group collector interface concept">
          <div><strong>Team apparel</strong><span>18 / 24 responses</span></div>
          <i><b style={{ width: '75%' }} /></i>
          <ul><li><span>Jordan M.</span><b>XL · submitted</b></li><li><span>Taylor R.</span><b>M · submitted</b></li><li><span>6 remaining</span><b>Awaiting response</b></li></ul>
        </div>
      </section>

      <section className="home-process home-process--compact">
        <div><span className="eyebrow">From request to distribution</span><h2>One project state from the first count to the reorder.</h2></div>
        <ProcessRail />
      </section>

      <section className="faq-split">
        <div><span className="eyebrow">Quick answers</span><h2>What groups usually need to know.</h2></div>
        <FaqList />
      </section>

      <ActionBand title="Have a rough headcount?" copy="That is enough to begin a useful bulk conversation." primary={{ label: 'Get a bulk quote', href: '/start-order?type=bulk' }} />
    </>
  );
}

export function OrganizationsPage() {
  return <BulkOrdersPage />;
}

export function EmbroideryPage() {
  return (
    <>
      <CompactHero
        eyebrow="Embroidery"
        title="A stitched finish when the apparel needs to feel established."
        description="Strong for polos, hats, jackets, workwear, uniforms, bags, and compact marks designed to hold up over time."
        primary={{ label: 'Design with embroidery', href: '/studio?garment=polo' }}
        secondary={{ label: 'Request a quote', href: '/start-order?type=custom' }}
        media={<img src="/store/polo.svg" alt="Polo prepared for embroidery" />}
      />

      <section className="fit-comparison">
        <div className="fit-comparison__yes"><span>Great fit</span><h2>When texture and repeated wear matter.</h2><ul><li>Staff and uniform apparel</li><li>Polos and outerwear</li><li>Caps and compact branding</li><li>Simple, readable logos</li></ul></div>
        <div><span>Consider another method</span><h2>When the artwork depends on print behavior.</h2><ul><li>Large photographic artwork</li><li>Fine gradients</li><li>Very small detail</li><li>Oversized full-front graphics</li></ul></div>
      </section>

      <section className="placement-visual">
        <div><span className="eyebrow">Common placements</span><h2>Placement follows the garment—not a generic coordinate.</h2><p>Chest, sleeve, hat, upper-back, bag, and other locations are reviewed against seams, pockets, panels, and the actual artwork.</p></div>
        <div className="placement-chips"><span>Left chest</span><span>Right chest</span><span>Hat front</span><span>Hat side</span><span>Sleeve</span><span>Upper back</span><span>Bag / accessory</span></div>
      </section>

      <details className="production-help"><summary>What happens to artwork before embroidery?</summary><p>Artwork is reviewed for detail, thin lines, gradients, and size. Production embroidery requires stitch instructions, backing and hooping decisions, and final confirmation against the actual garment.</p></details>

      <ActionBand title="Want to see the idea on a garment first?" copy="Use Studio for placement and concept planning, then send the project for real production review." primary={{ label: 'Open Studio', href: '/studio?garment=polo' }} secondary={{ label: 'Start a request', href: '/start-order' }} />
    </>
  );
}

export function GraphicApparelPage() {
  return (
    <>
      <CompactHero
        eyebrow="Graphic apparel"
        title="For artwork that needs more room to speak."
        description="Graphic decoration supports creator art, events, communities, team graphics, business pieces, and individual designs where color and scale matter."
        primary={{ label: 'Design a graphic piece', href: '/studio?garment=tee' }}
        secondary={{ label: 'Request a quote', href: '/start-order?type=custom' }}
        media={<img src="/store/tee.svg" alt="Graphic tee development visual" />}
      />

      <section className="method-use-grid">
        <article><span>Detailed / colorful</span><h2>Transfer & print pathways</h2><p>Useful when the image contains multiple colors, fine shapes, or artwork-led presentation.</p></article>
        <article><span>Repeat graphics</span><h2>Production-efficient runs</h2><p>Some projects become more efficient at larger quantities depending on colors, garment, and method.</p></article>
        <article><span>Names / numbers</span><h2>Personalized pieces</h2><p>Team numbers, names, sleeves, and other variable placements need their own production plan.</p></article>
      </section>

      <section className="artwork-readiness">
        <div><span className="eyebrow">Artwork readiness</span><h2>Bring the best file you have.</h2><p>Vector or high-resolution transparent art is ideal, but a logo, sketch, screenshot, or unfinished concept can still start the review.</p></div>
        <div><b>Best starting files</b><span>SVG / AI / EPS</span><span>High-resolution PNG</span><span>Original editable artwork</span><span>Defined brand colors</span></div>
      </section>

      <ActionBand title="Have the design but not the garment?" copy="Build the visual in Studio or send the artwork and let the project review determine the best production route." primary={{ label: 'Open Studio', href: '/studio?garment=tee' }} secondary={{ label: 'Start a request', href: '/start-order' }} />
    </>
  );
}

export function CreatorMerchPage() {
  return (
    <>
      <CompactHero
        eyebrow="Creator merch"
        title="Build merchandise around the creator—not around a generic catalog."
        description="BEE's creator path is designed for focused drops, restocks, and future storefronts where the creator and community stay visible."
        primary={{ label: 'Plan a merch drop', href: '/start-order?type=creator' }}
        secondary={{ label: 'Design a first piece', href: '/studio?garment=hoodie' }}
        media={<img src="/store/hoodie.svg" alt="Creator hoodie development visual" />}
      />

      <section className="creator-paths">
        <article><span>Launch</span><h2>Build a first drop</h2><p>Start focused with one or two pieces, approve samples, and learn what the audience actually wants.</p></article>
        <article><span>Restock</span><h2>Bring back what worked</h2><p>Reuse approved design and production context while reconfirming current garment availability and pricing.</p></article>
        <article><span>Storefront</span><h2>Create a home for the collection</h2><p>Future creator stores can combine campaign identity, products, order status, and community links under BEE's commerce system.</p></article>
      </section>

      <section className="creator-feature-placeholder">
        <div><span className="eyebrow">Featured creator</span><h2>The creator becomes the campaign.</h2><p>The first approved creator collaboration will replace this development state with real campaign media, product cards, social links, and a direct collection path.</p></div>
        <div className="creator-banner-skeleton"><span>Campaign media</span><b>Creator identity + collection</b><small>Real collaboration required before publication</small></div>
      </section>

      <section className="creator-flow"><span>Concept</span><b>→</b><span>Sample</span><b>→</b><span>Approve</span><b>→</b><span>Launch</span><b>→</b><span>Restock</span></section>

      <ActionBand title="Have an audience and an idea?" copy="Start with the creator, concept, intended products, rough quantity, and target launch." primary={{ label: 'Plan a merch drop', href: '/start-order?type=creator' }} />
    </>
  );
}

export function PortfolioPage() {
  return (
    <>
      <CompactHero
        eyebrow="Sample Lab / Our Work"
        title="Show the result. Explain only what helps."
        description="This page will grow from BEE-owned production tests into approved customer work. Until the physical samples exist, it stays intentionally small."
        primary={{ label: 'Start a project', href: '/start-order' }}
      />

      <section className="sample-lab-status">
        <div><span>Current state</span><h2>Physical sample photography is the next requirement.</h2></div>
        <p>Planned evidence includes stitch-detail photography, print texture, garment fit, wash testing, placement comparisons, and finished BEE-owned sample pieces. Development mockups will not be presented as completed customer projects.</p>
      </section>

      <section className="sample-lab-plan">
        <article><span>01</span><h2>Embroidery detail</h2><p>Macro stitch quality, edge clarity, backing, and small-detail behavior.</p></article>
        <article><span>02</span><h2>Graphic finish</h2><p>Color, hand feel, detail, stretch behavior, and garment interaction.</p></article>
        <article><span>03</span><h2>Finished piece</h2><p>Front/back presentation, placement, scale, fit, and real-world photography.</p></article>
      </section>

      <ActionBand title="The next real project can become part of the story." copy="Completed work is featured only with approval and only with details that accurately describe what was produced." primary={{ label: 'Start a project', href: '/start-order' }} />
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <CompactHero
        eyebrow="About BEE"
        title="A custom apparel shop being built around better project habits from day one."
        description="BEE Organization is developing its production setup and customer systems together so clear quoting, proofing, order records, and reorders are part of the operation—not afterthoughts."
        primary={{ label: 'Start a project', href: '/start-order' }}
        secondary={{ label: 'See what BEE makes', href: '/#capabilities' }}
      />

      <section className="about-principles">
        <article><span>01</span><h2>Clear before committed</h2><p>Garment, artwork, placement, quantity, timing, and pricing should be understood before production starts.</p></article>
        <article><span>02</span><h2>Make the method fit the project</h2><p>Embroidery and graphic decoration are chosen around the garment and design rather than forcing every request through one process.</p></article>
        <article><span>03</span><h2>Keep what makes the next order easier</h2><p>Approved artwork and project context should become useful production memory for future work.</p></article>
      </section>

      <section className="about-stage">
        <div><span className="eyebrow">Where the business is now</span><h2>Early stage, deliberately documented.</h2></div>
        <p>BEE is still acquiring equipment, refining production methods, creating samples, and preparing for its first official sale. The website does not invent testimonials, capacity claims, turnaround promises, or customer history to hide that stage.</p>
      </section>

      <ActionBand title="Have something BEE can help make?" copy="Start with the project, not a perfect brief." primary={{ label: 'Start a project', href: '/start-order' }} secondary={{ label: 'Design in Studio', href: '/studio' }} />
    </>
  );
}

type IntakeType = 'custom' | 'bulk' | 'creator' | 'unsure';
type IntakeState = {
  type: IntakeType;
  garment: string;
  quantity: string;
  artwork: string;
  deadline: string;
  fulfillment: string;
  personalization: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  notes: string;
};

const emptyIntake: IntakeState = {
  type: 'custom', garment: '', quantity: '', artwork: '', deadline: '', fulfillment: '', personalization: '', name: '', organization: '', email: '', phone: '', notes: '',
};

function requestedType(): IntakeType {
  const value = new URLSearchParams(window.location.search).get('type');
  return value === 'bulk' || value === 'creator' || value === 'unsure' ? value : 'custom';
}

export function StartOrderPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<IntakeState>(() => ({ ...emptyIntake, type: requestedType() }));
  const [submitted, setSubmitted] = useState(false);

  const summary = useMemo(() => [
    ['Project', data.type], ['Garment', data.garment || 'Not decided'], ['Quantity', data.quantity || 'Not decided'], ['Artwork', data.artwork || 'Not decided'], ['Deadline', data.deadline || 'Not provided'], ['Fulfillment', data.fulfillment || 'Not decided'], ['Personalization', data.personalization || 'None noted'], ['Contact', data.name], ['Organization / brand', data.organization || 'Not provided'], ['Email', data.email], ['Phone', data.phone || 'Not provided'], ['Notes', data.notes || 'None'],
  ], [data]);

  function update<K extends keyof IntakeState>(key: K, value: IntakeState[K]) {
    setData((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setStep(4);
  }

  return (
    <section className="intake-page">
      <header className="intake-heading">
        <div><span className="eyebrow">Start a project</span><h1>Tell BEE what you know. Leave the rest for review.</h1></div>
        <p>This pre-launch form stays in your browser. The production version will securely create a project, accept files, send confirmation, and place the request into BEE's quote workflow.</p>
      </header>

      <div className="intake-progress" aria-label={`Step ${step} of 4`}>
        {[1, 2, 3, 4].map((number) => <button key={number} type="button" className={step === number ? 'is-active' : step > number ? 'is-complete' : undefined} onClick={() => setStep(number)}><span>{number}</span><b>{['Project', 'Details', 'Timing', 'Contact'][number - 1]}</b></button>)}
      </div>

      <form className="intake-form" onSubmit={submit}>
        {step === 1 && <fieldset><legend>What are you making?</legend><div className="intake-choice-grid">
          {([['custom', 'Custom apparel', 'A piece or small project you want designed or produced.'], ['bulk', 'Group / bulk order', 'A coordinated order for a team, school, business, organization, or event.'], ['creator', 'Creator merchandise', 'A drop, restock, or creator collection.'], ['unsure', 'Not sure yet', 'Start with the goal and let the review determine the path.']] as const).map(([value, title, copy]) => <button type="button" key={value} className={data.type === value ? 'is-active' : undefined} onClick={() => update('type', value)}><strong>{title}</strong><span>{copy}</span></button>)}
        </div><button className="button intake-next" type="button" onClick={() => setStep(2)}>Continue to details</button></fieldset>}

        {step === 2 && <fieldset><legend>What do you already know?</legend><div className="intake-fields">
          <label>Garment or item<input value={data.garment} onChange={(e) => update('garment', e.target.value)} placeholder="Example: black hoodies and tees" /></label>
          <label>Estimated quantity<input value={data.quantity} onChange={(e) => update('quantity', e.target.value)} placeholder="Example: 24–36 pieces" /></label>
          <label className="intake-wide">Artwork status<select value={data.artwork} onChange={(e) => update('artwork', e.target.value)}><option value="">Choose one</option><option>Production-ready artwork available</option><option>Artwork exists but needs review</option><option>Concept or sketch only</option><option>Design help needed</option></select></label>
        </div><div className="intake-nav"><button type="button" onClick={() => setStep(1)}>Back</button><button className="button" type="button" onClick={() => setStep(3)}>Continue</button></div></fieldset>}

        {step === 3 && <fieldset><legend>When and how does it need to happen?</legend><div className="intake-fields">
          <label>Need-by date<input type="date" value={data.deadline} onChange={(e) => update('deadline', e.target.value)} /></label>
          <label>Fulfillment<select value={data.fulfillment} onChange={(e) => update('fulfillment', e.target.value)}><option value="">Not decided</option><option>Pickup</option><option>Bulk delivery</option><option>Shipping</option><option>Individual fulfillment may be needed</option></select></label>
          <label className="intake-wide">Personalization / roster needs<input value={data.personalization} onChange={(e) => update('personalization', e.target.value)} placeholder="Names, numbers, departments, size collection, or none" /></label>
        </div><div className="intake-nav"><button type="button" onClick={() => setStep(2)}>Back</button><button className="button" type="button" onClick={() => setStep(4)}>Continue</button></div></fieldset>}

        {step === 4 && !submitted && <fieldset><legend>Who should BEE contact?</legend><div className="intake-fields">
          <label>Name<input required value={data.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" /></label>
          <label>Organization / brand<input value={data.organization} onChange={(e) => update('organization', e.target.value)} autoComplete="organization" /></label>
          <label>Email<input required type="email" value={data.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" /></label>
          <label>Phone<input type="tel" value={data.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" /></label>
          <label className="intake-wide">Anything else?<textarea rows={5} value={data.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Sizes, colors, event context, placements, or questions." /></label>
        </div><div className="intake-nav"><button type="button" onClick={() => setStep(3)}>Back</button><button className="button" type="submit">Prepare request</button></div></fieldset>}
      </form>

      {submitted && <div className="intake-summary" aria-live="polite"><span className="eyebrow">Request prepared</span><h2>Review the project summary.</h2><dl>{summary.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p>No information was transmitted. Backend submission, secure uploads, project references, notifications, and customer accounts are still required before launch.</p><button className="button" type="button" onClick={() => setSubmitted(false)}>Edit contact details</button></div>}
    </section>
  );
}

export function NotFoundPage() {
  return (
    <section className="not-found not-found--v3">
      <span className="eyebrow">404</span>
      <h1>That route is not part of the current BEE experience.</h1>
      <p>Return home, design a custom piece, or start a project.</p>
      <div><a className="button" href="/">Return home</a><a className="text-link" href="/studio">Open Studio →</a></div>
    </section>
  );
}
