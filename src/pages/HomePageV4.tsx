import { faqs } from "../content/siteContent";
export function HomePageV4() {
  return (
    <>
      <section className="bee-hero">
        <div className="bee-hero-copy">
          <span className="eyebrow">Custom apparel & embroidery</span>
          <h1>
            Made for
            <br />
            your people.
            <br />
            <em>Works by BEE.</em>
          </h1>
          <p>
            For the team showing up together. The business building its name.
            The creator bringing a community closer. Let’s make something that
            represents you.
          </p>
          <div className="bee-actions">
            <a className="button" href="/start-order">
              Start your project <span aria-hidden="true">↗</span>
            </a>
            <a href="/bulk-orders">Planning a group order? →</a>
          </div>
          <div className="hero-signature">
            <span>BUILD</span>
            <i />
            <span>EMPOWER</span>
            <i />
            <span>EQUIP</span>
          </div>
        </div>
        <div className="bee-hero-art">
          <div className="arc-orbit" aria-hidden="true" />
          <span className="hero-art-label">The starting point is yours.</span>
          <img
            className="hero-hoodie"
            src="/store/hoodie.svg"
            alt="Illustrated custom hoodie concept"
            width="500"
            height="610"
          />
          <img
            className="hero-polo"
            src="/store/polo.svg"
            alt="Illustrated polo concept"
            width="500"
            height="610"
          />
          <div className="hero-art-caption">
            <strong>Your identity. Made wearable.</strong>
            <span>Garment concepts · final details reviewed with you</span>
          </div>
        </div>
      </section>
      <section className="bee-audiences bee-page">
        <div className="bee-section-heading">
          <span className="eyebrow">Find your starting point</span>
          <h2>
            A different purpose.
            <br />
            The same attention to detail.
          </h2>
        </div>
        <div className="bee-audience-grid">
          <a href="/bulk-orders">
            <span>01 / Together</span>
            <h3>Groups & businesses</h3>
            <p>
              School spirit, team apparel, staff uniforms, events, and the next
              order after that.
            </p>
            <b>Plan a group order ↗</b>
          </a>
          <a href="/creator-merch">
            <span>02 / Connected</span>
            <h3>Creators & communities</h3>
            <p>
              A first piece, a focused drop, or an idea your audience can make
              their own.
            </p>
            <b>Build your merch ↗</b>
          </a>
          <a href="/custom-apparel">
            <span>03 / Individual</span>
            <h3>Something personal</h3>
            <p>
              Bring your artwork or a rough idea. Explore the garment and finish
              that fit.
            </p>
            <b>Explore custom apparel ↗</b>
          </a>
        </div>
      </section>
      <section className="bee-craft bee-page">
        <div className="bee-craft-art">
          <img
            src="/store/polo.svg"
            alt="Polo garment illustration"
            loading="lazy"
            width="500"
            height="610"
          />
          <span>Embroidery / graphic apparel</span>
        </div>
        <div>
          <span className="eyebrow">The details make the piece</span>
          <h2>
            More than a logo
            <br />
            on a blank.
          </h2>
          <p>
            The garment, the artwork, the placement, and the finish should work
            together. We’ll help you think through the options before anything
            moves into production.
          </p>
          <div className="bee-craft-options">
            <a href="/embroidery">
              <strong>Embroidery</strong>
              <span>Stitched marks for polos, hats, layers and more.</span>
              <b>↗</b>
            </a>
            <a href="/graphic-apparel">
              <strong>Graphic apparel</strong>
              <span>Space for colorful artwork, names and larger designs.</span>
              <b>↗</b>
            </a>
          </div>
          <a className="text-link" href="/studio">
            Have a direction? Try it in Studio →
          </a>
        </div>
      </section>
      <section className="bee-process bee-page">
        <div className="bee-section-heading">
          <span className="eyebrow">A clear path to made</span>
          <h2>Know what comes next.</h2>
        </div>
        <ol>
          {[
            [
              "Share the idea",
              "Who it’s for, what you need, and the timing you have in mind.",
            ],
            [
              "Confirm the quote",
              "Review garment options, quantities, decoration, and pricing.",
            ],
            [
              "Approve the proof",
              "Confirm the artwork and placement before production.",
            ],
            [
              "Wear it. Build on it.",
              "Keep the useful details for the next run, new hire, or new idea.",
            ],
          ].map(([title, copy], i) => (
            <li key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="bee-belief bee-page">
        <span className="eyebrow">What BEE stands for</span>
        <h2>
          Build an identity.
          <br />
          <em>Empower a community.</em>
          <br />
          Equip your people.
        </h2>
        <p>
          Good apparel gives people something to belong to—and something they
          want to wear. That’s the purpose behind the work.
        </p>
        <a href="/about">Get to know BEE →</a>
      </section>
      <section className="bee-faq bee-page">
        <div>
          <span className="eyebrow">Before you begin</span>
          <h2>A few useful answers.</h2>
        </div>
        <div>
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="bee-final-cta bee-page">
        <div>
          <span className="eyebrow">Bring the idea</span>
          <h2>
            Let’s put your
            <br />
            identity to work.
          </h2>
        </div>
        <a className="button" href="/start-order">
          Plan your project ↗
        </a>
      </section>
    </>
  );
}
