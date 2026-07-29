import { useState } from 'react';
import { DirectionCard } from './components/DirectionCard';
import { LogoLockup } from './components/LogoLockup';
import { brandDirections } from './content/brandDirections';
import type { BrandDirection } from './types/brand';

const launchPillars = [
  ['Bulk programs', 'Affordable, dependable apparel for schools, teams, businesses, events, and community organizations.'],
  ['Creator goods', 'Custom collections for streamers and creators with reusable artwork, featured launches, and easy reorders.'],
  ['Individual custom', 'One-off garments and small runs without making personal customers feel secondary.'],
] as const;

const brandPrinciples = [
  ['Initials, not insects', 'BEE stands for Brian Eugene Everson. The identity should behave like a founder mark, not a hornet mascot.'],
  ['Built for production', 'Every core mark must survive embroidery, print, garment labels, invoices, social avatars, and one-color use.'],
  ['Expandable by design', 'The umbrella must support apparel now while leaving a credible path into creator services, hardware, or systems.'],
] as const;

function App() {
  const [selected, setSelected] = useState<BrandDirection>(brandDirections[1]!);

  return (
    <div id="top" className="site-shell">
      <header className="topbar">
        <LogoLockup />
        <nav aria-label="Primary">
          <a href="#directions">Name routes</a>
          <a href="#recommendation">Recommendation</a>
          <a href="#foundation">Business foundation</a>
        </nav>
        <a className="button button--small" href="#decision">Review the system</a>
      </header>

      <main>
        <section className="hero">
          <div className="hero__eyebrow"><span /> Brand reset · milestone 02</div>
          <h1>Custom apparel, built for your people.</h1>
          <p>
            A founder-led identity for Brian Eugene Everson—positioned to earn bulk orders from schools and organizations, create memorable merchandise for creators, and expand beyond apparel without starting over.
          </p>
          <div className="hero__actions">
            <a className="button" href="#directions">Compare name routes</a>
            <a className="text-link" href="#recommendation">Why BEE Assembly? ↘</a>
          </div>
          <div className="hero__mark" aria-hidden="true">
            <img src="/brand/rebrand/bee-assembly-mark.svg" alt="" />
          </div>
        </section>

        <section className="strategy-strip" aria-label="Brand strategy summary">
          <div><small>Legal owner</small><strong>BEE Organization LLC</strong></div>
          <div><small>Recommended public brand</small><strong>BEE Assembly</strong></div>
          <div><small>Founder meaning</small><strong>Brian Eugene Everson</strong></div>
          <div><small>Core promise</small><strong>Built together. Made to represent.</strong></div>
        </section>

        <section className="section principles" aria-label="Brand principles">
          <div className="section-heading">
            <div><span className="kicker">Non-negotiables</span><h2>A brand system that can do real work.</h2></div>
            <p>The visual identity is being rebuilt around the business model, production process, and Brian’s actual personality.</p>
          </div>
          <div className="principle-grid">
            {brandPrinciples.map(([title, description], index) => (
              <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
        </section>

        <section id="directions" className="section section--board">
          <div className="section-heading">
            <div><span className="kicker">Naming exploration</span><h2>Three credible routes. No mascot dependency.</h2></div>
            <p>Select a route to compare its position, audience, voice, and visual direction.</p>
          </div>
          <div className="direction-grid">
            {brandDirections.map((direction) => (
              <DirectionCard key={direction.id} direction={direction} active={selected.id === direction.id} onSelect={setSelected} />
            ))}
          </div>

          <div id="decision" className="selected-direction">
            <div className="selected-direction__visual">
              <span>Currently reviewing</span>
              <img src={selected.logo} alt={`${selected.name} logo concept`} />
            </div>
            <div>
              <span className="kicker">Route {selected.number}</span>
              <h3>{selected.name}</h3>
              <p>{selected.thesis}</p>
              <blockquote>“{selected.tagline}”</blockquote>
            </div>
          </div>
        </section>

        <section id="recommendation" className="section recommendation">
          <div className="recommendation__copy">
            <span className="kicker">DTB recommendation</span>
            <h2>Build the public brand around BEE Assembly.</h2>
            <p>
              “Assembly” connects the audiences and the process: groups assemble around a shared identity, apparel is assembled and decorated to order, and Brian is naturally a builder who enjoys hardware and systems. BEE remains meaningful because it is his name—not because the company needs a cartoon bee.
            </p>
            <ul>
              <li>Clear separation between the public brand and BEE Organization LLC.</li>
              <li>Memorable enough for creator merchandise while credible for school proposals.</li>
              <li>Expandable into Apparel, Creator Goods, Programs, and future Systems divisions.</li>
              <li>Flat modular mark designed for embroidery before digital effects.</li>
            </ul>
          </div>
          <div className="recommendation__lockup">
            <img src="/brand/rebrand/bee-assembly-horizontal-dark.svg" alt="BEE Assembly modular identity" />
            <div className="application-row"><span>CAP</span><span>POLO</span><span>LABEL</span><span>DIGITAL</span></div>
          </div>
        </section>

        <section id="foundation" className="section section--foundation">
          <div className="section-heading">
            <div><span className="kicker">Business foundation</span><h2>Three customers. One repeatable order system.</h2></div>
          </div>
          <div className="pillar-grid">
            {launchPillars.map(([title, description]) => (
              <article key={title}><span>{title.slice(0, 2).toUpperCase()}</span><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
          <div className="workflow">
            {['Choose service', 'Upload artwork', 'Receive quote', 'Approve proof', 'Pay deposit', 'Production', 'Deliver', 'Reorder'].map((step, index) => (
              <div key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <LogoLockup compact />
        <p>BEE Assembly is a working public identity operated by BEE Organization LLC · Strategy and platform by Designed to Breakthrough LLC</p>
      </footer>
    </div>
  );
}

export default App;
