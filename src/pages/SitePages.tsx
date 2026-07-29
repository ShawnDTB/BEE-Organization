import { useState, type FormEvent, type ReactNode } from 'react';
import { faqs, orderSteps, serviceCards, siteConfig, trustPoints } from '../content/siteContent';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  aside?: ReactNode;
};

function PageHero({
  eyebrow,
  title,
  description,
  primaryLabel = 'Start an order',
  primaryHref = '/start-order',
  secondaryLabel,
  secondaryHref,
  aside,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero__copy">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="page-hero__actions">
          <a className="button" href={primaryHref}>{primaryLabel}</a>
          {secondaryLabel && secondaryHref && <a className="text-link" href={secondaryHref}>{secondaryLabel} →</a>}
        </div>
      </div>
      <div className="page-hero__aside">{aside ?? <InterimBrandPanel />}</div>
    </section>
  );
}

function InterimBrandPanel() {
  return (
    <div className="interim-panel">
      <img src="/brand/placeholder/bee-organization-mark.svg" alt="Temporary BEE Organization identifier" />
      <span>Working identity</span>
      <strong>BEE Organization</strong>
      <p>The final public name and logo are intentionally not locked yet.</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}

function TrustGrid() {
  return (
    <div className="trust-grid">
      {trustPoints.map(([title, description], index) => (
        <article key={title}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </article>
      ))}
    </div>
  );
}

function ProcessSteps({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'process-grid process-grid--compact' : 'process-grid'}>
      {orderSteps.map(([number, title, description]) => (
        <article key={number}>
          <span>{number}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </article>
      ))}
    </div>
  );
}

function FaqList({ items = faqs }: { items?: readonly (readonly [string, string])[] }) {
  return (
    <div className="faq-list">
      {items.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}

function CtaBand({ title, description, label = 'Start an order', href = '/start-order' }: { title: string; description: string; label?: string; href?: string }) {
  return (
    <section className="cta-band">
      <div>
        <span className="eyebrow">Next step</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <a className="button" href={href}>{label}</a>
    </section>
  );
}

const audienceCards = [
  ['Schools & teams', 'Spirit wear, staff apparel, club orders, team programs, events, and organized reorders.', '/schools-organizations'],
  ['Organizations & businesses', 'Branded uniforms, event apparel, employee pieces, promotional programs, and repeat ordering.', '/schools-organizations'],
  ['Creators & communities', 'Merchandise concepts, limited runs, community pieces, creator spotlights, and scalable future releases.', '/creator-merch'],
  ['Individuals & families', 'Custom gifts, personal artwork, celebrations, memorial pieces, reunions, and small-run requests.', '/start-order'],
] as const;

export function HomePage() {
  return (
    <>
      <PageHero
        eyebrow="Custom apparel platform"
        title="Apparel made to represent something real."
        description="BEE Organization is building a clear, organized way for schools, teams, organizations, creators, businesses, and individuals to order embroidery and graphic apparel without an inflated or confusing process."
        primaryLabel="Start a project"
        secondaryLabel="Explore services"
        secondaryHref="#services"
        aside={
          <div className="hero-dashboard">
            <span className="hero-dashboard__label">Order paths</span>
            <div><strong>Bulk</strong><small>Groups, programs, teams</small></div>
            <div><strong>Creator</strong><small>Merchandise and communities</small></div>
            <div><strong>Custom</strong><small>One-off and small-run work</small></div>
            <p>Quote → proof → production → reorder</p>
          </div>
        }
      />

      <section className="metric-strip" aria-label="Core service commitments">
        <div><strong>Structured quotes</strong><span>Project variables organized before production</span></div>
        <div><strong>Proof approval</strong><span>Placement and artwork reviewed first</span></div>
        <div><strong>Production-aware</strong><span>Method selected around the actual order</span></div>
        <div><strong>Reorder-ready</strong><span>Approved details retained for repeat work</span></div>
      </section>

      <section id="services" className="section">
        <SectionHeading
          eyebrow="Services"
          title="One production partner. Multiple ways to order."
          description="Each service page explains what information is needed, what affects pricing, and where the method works best."
        />
        <div className="service-grid">
          {serviceCards.map((service) => (
            <a className="service-card" key={service.title} href={service.href}>
              <span>{service.code}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <small>{service.audience}</small>
              <b>Explore service →</b>
            </a>
          ))}
        </div>
      </section>

      <section className="section section--contrast">
        <SectionHeading
          eyebrow="Who it is for"
          title="Built around the people wearing it."
          description="The customer is the focus. The site routes each type of buyer into the right information and intake process."
        />
        <div className="audience-grid">
          {audienceCards.map(([title, description, href]) => (
            <a key={title} href={href}>
              <h3>{title}</h3>
              <p>{description}</p>
              <span>View path →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="How ordering works"
          title="A custom process without unnecessary friction."
          description="The workflow is designed to protect the customer and production team from vague expectations, missing sizes, and unapproved artwork."
        />
        <ProcessSteps />
      </section>

      <section className="section section--split">
        <div>
          <span className="eyebrow">Why the system matters</span>
          <h2>Good apparel starts before the machine turns on.</h2>
          <p>Garment choice, artwork condition, decoration method, placement, quantity, deadline, and approval all affect the final result. The website is being built to collect those decisions clearly instead of spreading them across messages.</p>
          <a className="text-link" href="/start-order">See the order intake →</a>
        </div>
        <TrustGrid />
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="Featured work"
          title="Real projects will lead the portfolio."
          description="The launch portfolio will use completed, approved customer work—never invented reviews, fake order counts, or stock examples presented as client results."
        />
        <div className="portfolio-preview">
          {['Embroidery detail', 'Bulk program', 'Creator collection'].map((title, index) => (
            <a key={title} href="/our-work">
              <div className="media-placeholder"><span>Portfolio media {String(index + 1).padStart(2, '0')}</span></div>
              <h3>{title}</h3>
              <p>Photography and project details pending approved completed work.</p>
            </a>
          ))}
        </div>
      </section>

      <CtaBand
        title="Have an order in mind? Start with the details you already know."
        description="Quantity ranges and unfinished artwork are okay. The intake is designed to identify what still needs to be decided."
      />
    </>
  );
}

export function BulkOrdersPage() {
  const factors = [
    ['Garment', 'Brand, style, material, color, size range, and supplier availability.'],
    ['Quantity', 'Total pieces and whether the artwork or personalization changes between garments.'],
    ['Decoration', 'Embroidery, transfer, print method, number of locations, and artwork complexity.'],
    ['Schedule', 'Approval timing, garment availability, production capacity, and delivery requirements.'],
  ] as const;

  return (
    <>
      <PageHero
        eyebrow="Bulk orders"
        title="Group apparel without a scattered ordering process."
        description="Bulk programs are designed for schools, teams, clubs, businesses, events, organizations, and communities that need consistent apparel, organized quantities, and a dependable path to reorder."
        secondaryLabel="Schools and organizations"
        secondaryHref="/schools-organizations"
      />
      <section className="section">
        <SectionHeading eyebrow="Quote structure" title="What determines a bulk quote." description="Public flat pricing would be misleading before these variables are known." />
        <div className="feature-grid feature-grid--four">
          {factors.map(([title, description], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>
      <section className="section section--contrast">
        <SectionHeading eyebrow="Program support" title="Designed for more than one box of shirts." />
        <div className="two-column-list">
          <div>
            <h3>Order organization</h3>
            <ul>
              <li>Garment and color selection</li>
              <li>Size and quantity breakdowns</li>
              <li>Multiple decoration locations</li>
              <li>Names, numbers, or department variants</li>
              <li>Central proof approval</li>
            </ul>
          </div>
          <div>
            <h3>Repeat-order preparation</h3>
            <ul>
              <li>Reference numbers for prior orders</li>
              <li>Retained approved artwork</li>
              <li>Updated size and quantity collection</li>
              <li>Supplier and pricing reconfirmation</li>
              <li>Consistent placement references</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section">
        <SectionHeading eyebrow="Order stages" title="Every approval has a place." />
        <ProcessSteps compact />
      </section>
      <section className="section">
        <SectionHeading eyebrow="Common questions" title="Bulk-order answers before you begin." />
        <FaqList />
      </section>
      <CtaBand title="Build a bulk-order request." description="Provide the estimated quantity, audience, garment type, decoration locations, and target date. Exact sizes can follow when appropriate." />
    </>
  );
}

export function EmbroideryPage() {
  const placements = ['Left chest', 'Right chest', 'Hat front', 'Hat side', 'Sleeve', 'Upper back', 'Bag or accessory'];
  const quality = [
    ['Artwork review', 'Logos are evaluated for small details, thin lines, gradients, and elements that may not translate directly to thread.'],
    ['Digitizing', 'Artwork must be converted into stitch instructions. Digitizing needs are confirmed before production.'],
    ['Garment support', 'Fabric weight, stretch, backing, hooping, and garment construction affect the result.'],
    ['Stitch testing', 'Final production standards should be based on real samples and machine output, not only a screen preview.'],
  ] as const;

  return (
    <>
      <PageHero eyebrow="Embroidery" title="A durable finish for apparel that needs to look established." description="Embroidery is suited for polos, hats, jackets, workwear, bags, uniforms, and branded pieces where texture and long-term wear matter." />
      <section className="section">
        <SectionHeading eyebrow="Best uses" title="Where embroidery earns its place." />
        <div className="tag-cloud">{['Staff apparel', 'Uniforms', 'Polos', 'Hats', 'Outerwear', 'Workwear', 'Team gear', 'Creator caps', 'Bags'].map((item) => <span key={item}>{item}</span>)}</div>
      </section>
      <section className="section section--contrast">
        <SectionHeading eyebrow="Production considerations" title="Thread has different rules than a screen." description="Not every visual effect should be forced into embroidery. The artwork may need to be simplified to preserve clarity." />
        <div className="feature-grid">{quality.map(([title, description], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>
      <section className="section section--split">
        <div>
          <span className="eyebrow">Placement planning</span>
          <h2>Choose the location with the garment, logo, and wearer in mind.</h2>
          <p>Placement size and position are confirmed during proofing. Seams, pockets, panels, closures, and hat construction can limit usable space.</p>
        </div>
        <div className="placement-list">{placements.map((placement, index) => <div key={placement}><span>{String(index + 1).padStart(2, '0')}</span><strong>{placement}</strong></div>)}</div>
      </section>
      <section className="section">
        <SectionHeading eyebrow="Before requesting a quote" title="Helpful information to include." />
        <div className="checklist-grid">
          <div><b>Garment type</b><span>Hat, polo, jacket, uniform, bag, or customer-supplied item.</span></div>
          <div><b>Quantity range</b><span>An estimate is useful even before every size is collected.</span></div>
          <div><b>Logo file</b><span>Vector artwork is preferred, but available files can be reviewed.</span></div>
          <div><b>Placement</b><span>Identify each intended decoration location.</span></div>
          <div><b>Thread colors</b><span>Provide brand references where color matching matters.</span></div>
          <div><b>Target date</b><span>Share the actual event or need-by date, not only a preferred completion date.</span></div>
        </div>
      </section>
      <CtaBand title="Request an embroidery review." description="Send the garment idea, quantity range, logo, placement, and target date so the project can be evaluated correctly." />
    </>
  );
}

export function GraphicApparelPage() {
  const methods = [
    ['Direct-to-film and transfer methods', 'Useful for detailed, colorful, and smaller-run graphics. Material, finish, durability, and placement are reviewed per project.'],
    ['Screen-printing pathways', 'Often appropriate for repeat graphics and larger quantities. Availability and economics depend on colors, locations, and production partner requirements.'],
    ['Specialty applications', 'Names, numbers, layered placements, sleeves, and nonstandard garments require individual planning and testing.'],
  ] as const;

  return (
    <>
      <PageHero eyebrow="Graphic apparel" title="Artwork-forward apparel matched to the right production method." description="Graphic apparel can support detailed illustrations, creator designs, event pieces, team graphics, business apparel, and individual custom work. The method is selected after reviewing the actual project." />
      <section className="section">
        <SectionHeading eyebrow="Method selection" title="The artwork and order decide the process." description="No single decoration method is automatically best for every image, fabric, quantity, or use case." />
        <div className="feature-grid feature-grid--three">{methods.map(([title, description], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>
      <section className="section section--contrast">
        <SectionHeading eyebrow="Artwork readiness" title="Files that produce more predictable results." />
        <div className="two-column-list">
          <div>
            <h3>Preferred</h3>
            <ul>
              <li>Vector files when available</li>
              <li>High-resolution transparent artwork</li>
              <li>Defined colors and intended print size</li>
              <li>Original source files for editable designs</li>
              <li>Clear placement references</li>
            </ul>
          </div>
          <div>
            <h3>Still reviewable</h3>
            <ul>
              <li>Logos from existing websites or documents</li>
              <li>Sketches and incomplete concepts</li>
              <li>Low-resolution files needing recreation</li>
              <li>Designs that require color separation</li>
              <li>Ideas without finished artwork</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section section--split">
        <div>
          <span className="eyebrow">Garment and placement</span>
          <h2>The same design can behave differently on different materials.</h2>
          <p>Fabric composition, garment color, stretch, texture, seams, and wash expectations affect method choice. Large front, back, sleeve, pocket, and leg placements each have different practical limits.</p>
        </div>
        <TrustGrid />
      </section>
      <CtaBand title="Have a design or an idea?" description="Upload-ready artwork is helpful but not required to begin the conversation. Describe the piece, audience, quantity, and intended use." />
    </>
  );
}

export function CreatorMerchPage() {
  const creatorStages = [
    ['Pilot', 'Develop one focused piece or a small test run before committing to a broad catalog.'],
    ['System', 'Organize logos, colors, artwork files, garment standards, placements, and reorder references.'],
    ['Launch', 'Prepare approved product visuals, release information, and a clear order window or inventory plan.'],
    ['Grow', 'Use real demand and customer feedback to decide what should be restocked, revised, or expanded.'],
  ] as const;

  return (
    <>
      <PageHero eyebrow="Creator merchandise" title="Merchandise that feels connected to the creator—not pasted onto a blank." description="The creator pathway is designed for streamers, content creators, musicians, artists, gaming communities, and emerging personal brands that need flexible runs and a consistent visual system." />
      <section className="section">
        <SectionHeading eyebrow="Creator pathway" title="Start focused. Build what the audience proves it wants." />
        <div className="feature-grid">{creatorStages.map(([title, description], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>
      <section className="section section--contrast">
        <SectionHeading eyebrow="Possible support" title="A merchandise system, not only a print file." description="Final service availability will depend on production capacity and the agreement for each creator." />
        <div className="checklist-grid">
          <div><b>Brand-file organization</b><span>Approved logos, colors, placements, and source artwork.</span></div>
          <div><b>Product development</b><span>Garment and decoration options matched to the audience and run size.</span></div>
          <div><b>Proof and mockup workflow</b><span>Clear review checkpoints before production or promotion.</span></div>
          <div><b>Small-run testing</b><span>Validate quality and interest before scaling.</span></div>
          <div><b>Creator spotlight</b><span>Feature approved collaborations and direct visitors to the creator’s content.</span></div>
          <div><b>Future storefront support</b><span>Storefront, fulfillment, and revenue-sharing options require separate operational agreements.</span></div>
        </div>
      </section>
      <section className="section section--split">
        <div>
          <span className="eyebrow">Creator spotlight</span>
          <h2>The person and community should remain visible.</h2>
          <p>Future creator features should explain who the creator is, what the design represents, how the product was developed, and where customers can support their content.</p>
          <p>No creator names, testimonials, sales claims, or campaign results will be published without approval.</p>
        </div>
        <div className="spotlight-placeholder">
          <span>Creator feature template</span>
          <div className="media-placeholder"><small>Approved creator photography</small></div>
          <strong>Story · product · community · links</strong>
        </div>
      </section>
      <CtaBand title="Plan a creator merchandise pilot." description="Share the creator profile, audience, concept, initial quantity, target launch, and any existing artwork or brand files." />
    </>
  );
}

export function OrganizationsPage() {
  const programs = [
    ['Schools', 'Staff apparel, student groups, clubs, events, spirit wear, graduation programs, and department orders.'],
    ['Teams', 'Practice apparel, coaching gear, supporter pieces, travel apparel, names, numbers, and seasonal reorders.'],
    ['Businesses', 'Uniforms, employee apparel, events, client gifts, department pieces, and repeat brand standards.'],
    ['Community organizations', 'Nonprofits, churches, clubs, reunions, fundraisers, volunteer programs, and local events.'],
  ] as const;

  return (
    <>
      <PageHero eyebrow="Schools and organizations" title="Custom apparel programs that stay organized as the group grows." description="This pathway prioritizes approvals, rosters, garment consistency, target dates, and reorders—the details that matter when many people are involved." />
      <section className="section">
        <SectionHeading eyebrow="Program types" title="Structured for real groups and repeat needs." />
        <div className="feature-grid">{programs.map(([title, description], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>
      <section className="section section--contrast">
        <SectionHeading eyebrow="Planning checklist" title="Information that keeps a group order moving." />
        <div className="checklist-grid">
          <div><b>Decision maker</b><span>Identify who can approve pricing, artwork, substitutions, and final quantities.</span></div>
          <div><b>Audience and purpose</b><span>Staff, students, players, supporters, volunteers, or event attendees.</span></div>
          <div><b>Quantity plan</b><span>Estimate totals and decide when final size collection will close.</span></div>
          <div><b>Artwork ownership</b><span>Confirm that logos, school marks, sponsors, and partner branding may be used.</span></div>
          <div><b>Target date</b><span>Provide the actual event or distribution date with enough time for approval and production.</span></div>
          <div><b>Distribution</b><span>Determine whether the order is bulk-delivered, separated, picked up, or shipped.</span></div>
        </div>
      </section>
      <section className="section">
        <SectionHeading eyebrow="Program process" title="A central path from idea to distribution." />
        <ProcessSteps compact />
      </section>
      <section className="section">
        <SectionHeading eyebrow="Transparency" title="What the site will not pretend." />
        <div className="notice-panel">
          <p>Pricing, turnaround, garment availability, decoration capability, and delivery terms depend on the actual order. Until production data is documented, this site will not publish invented savings percentages, guaranteed completion times, or unsupported volume claims.</p>
        </div>
      </section>
      <CtaBand title="Prepare a school or organization request." description="Begin with the group type, estimated quantity, intended use, target date, artwork, and the person authorized to approve the project." />
    </>
  );
}

export function PortfolioPage() {
  const categories = ['Embroidery', 'Graphic apparel', 'Bulk programs', 'Creator merchandise', 'Business apparel', 'Individual custom'];
  return (
    <>
      <PageHero eyebrow="Our work" title="A portfolio built from approved, completed projects." description="This page is structured for real product photography, close-up production details, customer context, and transparent project notes. Placeholder cards remain until work is approved for publication." primaryLabel="Start a similar project" />
      <section className="section">
        <SectionHeading eyebrow="Portfolio filters" title="Work will be organized by service and customer need." />
        <div className="tag-cloud">{categories.map((category) => <span key={category}>{category}</span>)}</div>
      </section>
      <section className="section section--contrast">
        <div className="portfolio-grid">
          {Array.from({ length: 9 }, (_, index) => (
            <article key={index}>
              <div className="media-placeholder"><span>Approved project media</span><small>Slot {String(index + 1).padStart(2, '0')}</small></div>
              <div>
                <span>{categories[index % categories.length]}</span>
                <h2>Project case study pending</h2>
                <p>Future entries will identify the objective, garment, decoration method, quantity range when approved, and production considerations.</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <SectionHeading eyebrow="Publication standard" title="Proof over invented social proof." />
        <TrustGrid />
      </section>
      <CtaBand title="Bring the next portfolio-worthy project." description="Completed customer work is only featured with permission and with details that accurately represent what was produced." />
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About BEE Organization" title="A production business being built around quality, organization, and practical service." description="BEE Organization LLC is developing a custom apparel operation for bulk buyers, creators, organizations, businesses, and individuals. The public brand identity is still being refined; the business foundation is being built now." primaryLabel="Explore services" primaryHref="/#services" secondaryLabel="Start an order" secondaryHref="/start-order" />
      <section className="section section--split">
        <div>
          <span className="eyebrow">Operating idea</span>
          <h2>Make custom ordering feel deliberate instead of improvised.</h2>
          <p>The business is being structured around clear intake, artwork review, itemized quotes, proof approval, production records, quality checks, and easier reorders.</p>
          <p>The long-term opportunity may extend beyond apparel, but the launch focus remains producing dependable embroidery and graphic goods for real customers.</p>
        </div>
        <div className="values-stack">
          <article><span>01</span><h3>Honest communication</h3><p>Set expectations from actual capacity and order details.</p></article>
          <article><span>02</span><h3>Production-minded decisions</h3><p>Choose methods around materials and use—not trends alone.</p></article>
          <article><span>03</span><h3>Respect for the customer’s identity</h3><p>The group, creator, business, or person should remain the focus.</p></article>
          <article><span>04</span><h3>Systems that improve</h3><p>Record what worked so future orders become easier and more consistent.</p></article>
        </div>
      </section>
      <section className="section section--contrast">
        <SectionHeading eyebrow="Business foundation" title="What is being built behind the website." />
        <div className="checklist-grid">
          <div><b>Customer intake</b><span>Structured project, garment, artwork, quantity, and deadline collection.</span></div>
          <div><b>Artwork records</b><span>Original files, proofs, approvals, and production-ready versions.</span></div>
          <div><b>Quote and payment workflow</b><span>Clear pricing and deposits before production commitments.</span></div>
          <div><b>Order tracking</b><span>Statuses from inquiry through completion and delivery.</span></div>
          <div><b>Reorder system</b><span>Reference prior approved details without assuming supplier conditions are unchanged.</span></div>
          <div><b>Analytics and improvement</b><span>Measure real inquiries, approvals, order types, and repeat business.</span></div>
        </div>
      </section>
      <section className="section">
        <SectionHeading eyebrow="Partnership" title="Built as DTB’s first flagship post-rebrand client platform." description="Designed to Breakthrough LLC is developing the brand strategy, website, platform architecture, deployment foundation, and future digital workflows." />
        <div className="notice-panel"><p>Commercial roles, intellectual property, revenue arrangements, maintenance, and ongoing responsibilities should be documented in a signed agreement before public commerce begins.</p></div>
      </section>
      <CtaBand title="See whether the project is a fit." description="Start with what you need, who it is for, and when it is needed. The quote process will identify the remaining decisions." />
    </>
  );
}

export function StartOrderPage() {
  const [summary, setSummary] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fields = [
      ['Contact', data.get('contactName')],
      ['Organization / brand', data.get('organization') || 'Not provided'],
      ['Email', data.get('email')],
      ['Phone', data.get('phone') || 'Not provided'],
      ['Project type', data.get('projectType')],
      ['Estimated quantity', data.get('quantity')],
      ['Target date', data.get('deadline') || 'Not provided'],
      ['Garment ideas', data.get('garment') || 'Not decided'],
      ['Decoration', data.get('decoration') || 'Needs recommendation'],
      ['Artwork status', data.get('artworkStatus')],
      ['Delivery preference', data.get('delivery') || 'Not decided'],
      ['Notes', data.get('notes') || 'None'],
    ];
    setSummary(fields.map(([label, value]) => `${label}: ${String(value)}`).join('\n'));
  }

  return (
    <>
      <PageHero eyebrow="Start an order" title="Tell us what you know. The process can organize the rest." description="This intake prototype helps structure a quote request. It does not currently transmit or save personal information; submission integration will be connected before public launch." primaryLabel="Review required details" primaryHref="#order-form" secondaryLabel="How ordering works" secondaryHref="/#services" />
      <section id="order-form" className="section order-section">
        <div className="order-section__intro">
          <span className="eyebrow">Quote intake prototype</span>
          <h2>Project details</h2>
          <p>Fields marked required are the minimum needed to prepare a useful request. Exact pricing is not generated automatically.</p>
          <div className="privacy-note"><strong>Prototype notice</strong><span>This form currently creates a summary in your browser only. It does not send data, upload artwork, or create an order.</span></div>
        </div>
        <form className="order-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Contact</legend>
            <label>Contact name<input name="contactName" required autoComplete="name" /></label>
            <label>Organization, team, school, or brand<input name="organization" autoComplete="organization" /></label>
            <label>Email<input name="email" required type="email" autoComplete="email" /></label>
            <label>Phone<input name="phone" type="tel" autoComplete="tel" /></label>
          </fieldset>
          <fieldset>
            <legend>Project</legend>
            <label>Project type<select name="projectType" required defaultValue=""><option value="" disabled>Select one</option><option>Bulk organization order</option><option>Embroidery</option><option>Graphic apparel</option><option>Creator merchandise</option><option>Individual custom work</option><option>Not sure yet</option></select></label>
            <label>Estimated quantity<input name="quantity" required placeholder="Example: 24–36 pieces" /></label>
            <label>Target date<input name="deadline" type="date" /></label>
            <label>Garment ideas<input name="garment" placeholder="Example: black hoodies and tees" /></label>
            <label>Preferred decoration<select name="decoration" defaultValue=""><option value="">Needs recommendation</option><option>Embroidery</option><option>Graphic transfer / print</option><option>Both embroidery and graphic decoration</option><option>Not sure</option></select></label>
            <label>Artwork status<select name="artworkStatus" required defaultValue=""><option value="" disabled>Select one</option><option>Production-ready artwork available</option><option>Logo or artwork exists but needs review</option><option>Only a concept or sketch exists</option><option>Design help is needed</option></select></label>
            <label>Delivery preference<select name="delivery" defaultValue=""><option value="">Not decided</option><option>Pickup</option><option>Bulk delivery</option><option>Shipping</option><option>Individual fulfillment may be needed</option></select></label>
            <label className="form-wide">Project notes<textarea name="notes" rows={6} placeholder="Describe the audience, garment colors, artwork locations, sizes, event, personalization, or anything unusual about the request." /></label>
          </fieldset>
          <button className="button" type="submit">Prepare request summary</button>
        </form>
        {summary && (
          <div className="request-summary" aria-live="polite">
            <span className="eyebrow">Prepared summary</span>
            <h2>Review before sending</h2>
            <textarea readOnly value={summary} rows={14} aria-label="Prepared project request summary" />
            <p>Copy this summary for internal review. Automated submission, secure artwork upload, notifications, and order-reference creation are planned for the backend phase.</p>
          </div>
        )}
      </section>
      <section className="section section--contrast">
        <SectionHeading eyebrow="What happens next" title="The request becomes a quote—not an automatic production order." />
        <ProcessSteps compact />
      </section>
    </>
  );
}

export function NotFoundPage() {
  return (
    <section className="not-found">
      <span className="eyebrow">404</span>
      <h1>This page is not part of the current build.</h1>
      <p>Return to the website or start a project from the order intake.</p>
      <div><a className="button" href="/">Return home</a><a className="text-link" href="/start-order">Start an order →</a></div>
    </section>
  );
}
