import { useState } from 'react';
import { DirectionCard } from './components/DirectionCard';
import { LogoLockup } from './components/LogoLockup';
import { brandDirections } from './content/brandDirections';
import type { BrandDirection } from './types/brand';

const launchPillars = [
  ['Bulk', 'Schools, teams, organizations, businesses, events, and community groups.'],
  ['Creators', 'Streamer and content-creator collections with spotlight and reorder support.'],
  ['Custom', 'Individual apparel, personal designs, gifts, and limited-run pieces.'],
] as const;

function App() {
  const [selected, setSelected] = useState<BrandDirection>(brandDirections[0]!);

  return (
    <div id="top" className="site-shell">
      <header className="topbar">
        <LogoLockup />
        <nav aria-label="Primary">
          <a href="#directions">Directions</a>
          <a href="#recommendation">Recommendation</a>
          <a href="#foundation">Foundation</a>
        </nav>
        <a className="button button--small" href="#decision">Review direction</a>
      </header>

      <main>
        <section className="hero">
          <div className="hero__eyebrow"><span /> Identity milestone 01</div>
          <h1>A brand built like the products behind it.</h1>
          <p>
            Three scalable directions for BEE Organization LLC—designed to move beyond a classic hornet mascot and establish a modern identity for apparel, creators, bulk clients, and future technology opportunities.
          </p>
          <div className="hero__actions">
            <a className="button" href="#directions">Explore directions</a>
            <a className="text-link" href="/brand/reference/identity-board-wide.png" target="_blank" rel="noreferrer">Open concept board ↗</a>
          </div>
          <div className="hero__mark" aria-hidden="true">
            <img src="/brand/final/bee-works-mark.svg" alt="" />
          </div>
        </section>

        <section className="strategy-strip" aria-label="Brand strategy summary">
          <div><small>Legal entity</small><strong>BEE Organization LLC</strong></div>
          <div><small>Working public brand</small><strong>BEE Works</strong></div>
          <div><small>Core promise</small><strong>Quality without inflated bulk pricing</strong></div>
          <div><small>Primary direction</small><strong>Engineered Monogram</strong></div>
        </section>

        <section id="directions" className="section section--board">
          <div className="section-heading">
            <div><span className="kicker">Three-direction board</span><h2>Distinct expressions. One strategic foundation.</h2></div>
            <p>Select a card to update the comparison panel below.</p>
          </div>
          <div className="direction-grid">
            {brandDirections.map((direction) => (
              <DirectionCard key={direction.id} direction={direction} active={selected.id === direction.id} onSelect={setSelected} />
            ))}
          </div>

          <div id="decision" className="selected-direction">
            <div className="selected-direction__visual">
              <span>Selected direction</span>
              <img src={selected.logo} alt={`${selected.name} selected logo`} />
            </div>
            <div>
              <span className="kicker">{selected.number}</span>
              <h3>{selected.name}</h3>
              <p>{selected.thesis}</p>
              <blockquote>“{selected.tagline}”</blockquote>
            </div>
          </div>
        </section>

        <section id="recommendation" className="section recommendation">
          <div className="recommendation__copy">
            <span className="kicker">DTB recommendation</span>
            <h2>Lead with the Engineered Monogram.</h2>
            <p>
              It feels closest to Brian: a hands-on builder, hardware enthusiast, gamer, and production-minded business owner. The mark is structured enough for schools and organizations, distinct enough for creator merchandise, and flexible enough to expand into technology later.
            </p>
            <ul>
              <li>Reduces cleanly for embroidery and garment labels.</li>
              <li>Works in one color before relying on gradients or effects.</li>
              <li>Uses the bee reference as subtle geometry, not a cartoon mascot.</li>
              <li>Creates a recognizable B icon independent of the final public name.</li>
            </ul>
          </div>
          <div className="recommendation__lockup">
            <img src="/brand/final/bee-works-horizontal-dark.svg" alt="BEE Works engineered monogram logo" />
            <div className="application-row"><span>CAP</span><span>CHEST</span><span>TAG</span><span>DIGITAL</span></div>
          </div>
        </section>

        <section id="foundation" className="section section--foundation">
          <div className="section-heading">
            <div><span className="kicker">Platform foundation</span><h2>Designed around the customer journey.</h2></div>
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
        <p>Working identity for BEE Organization LLC · Strategy and platform by Designed to Breakthrough LLC</p>
      </footer>
    </div>
  );
}

export default App;
