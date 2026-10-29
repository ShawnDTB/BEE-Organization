import { shopCategories } from "../content/storefront";
import { WorkGallery } from "../components/WorkGallery";
const categoryImages: Record<string, string> = {
  "t-shirts": "tee",
  hoodies: "hoodie",
  hats: "cap",
  decals: "decal",
  embroidery: "polo",
};
export function HomePageV4() {
  return (
    <div className="storefront">
      <section className="sf-hero sf-wrap">
        <div className="sf-hero-copy">
          <span className="sf-kicker">
            Works by BEE / Custom apparel & graphics
          </span>
          <h1>
            Custom gear.
            <br />
            <em>Made personal.</em>
          </h1>
          <p>
            Your artwork. Your interests. Your everyday favorites. Explore
            T-shirts, hoodies, hats, and custom details with a little more you
            in them.
          </p>
          <div className="sf-hero-actions">
            <a className="sf-button" href="/shop">
              Explore custom options <span aria-hidden="true">↗</span>
            </a>
            <a className="sf-text-link" href="/start-order">
              Plan your own <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="sf-hero-tags">
            <span>Printed apparel</span>
            <span>Embroidery</span>
            <span>Decal ideas</span>
          </div>
        </div>
        <figure className="sf-hero-art">
          <img
            src="/storefront/apparel-study.webp"
            width="1400"
            height="933"
            alt="Apparel design study: a textured charcoal hoodie, a cream T-shirt and a cap with abstract teal graphics"
            fetchPriority="high"
          />
          <figcaption>
            <strong>Make your mark.</strong>
            <span>AI-generated design study · Concept apparel</span>
          </figcaption>
        </figure>
      </section>
      <section id="categories" className="sf-section sf-wrap">
        <div className="sf-section-heading">
          <div>
            <span className="sf-kicker">Find your starting point</span>
            <h2>Pick your piece.</h2>
          </div>
          <a className="sf-text-link" href="/shop">
            All custom options <span aria-hidden="true">↗</span>
          </a>
        </div>
        <nav className="sf-categories" aria-label="Shop by product type">
          {shopCategories.slice(1).map((category) => (
            <a key={category.id} href={`/shop?category=${category.id}`}>
              <img
                src={`/storefront/${categoryImages[category.id]}.svg`}
                alt=""
                width="800"
                height="980"
                loading="lazy"
              />
              <strong>{category.label}</strong>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </section>
      <section className="sf-about sf-wrap" aria-labelledby="about-bee">
        <div>
          <span className="sf-kicker">Something only you would make</span>
          <h2 id="about-bee">
            Bring the idea.
            <br />
            <em>Let's find its form.</em>
          </h2>
        </div>
        <div>
          <p>
            A design for your crew. A gift with a story. An automotive graphic,
            a computer-inspired idea, or a piece for the people you work with.
          </p>
          <p>
            Start with the item and the idea. The artwork, finish, quantity, and
            price are worked through before production.
          </p>
          <a className="sf-text-link" href="/start-order">
            Build your custom brief <span aria-hidden="true">↗</span>
          </a>
          <small>
            The planner saves your idea on this device. Online ordering is being
            prepared.
          </small>
        </div>
      </section>
      <WorkGallery />
      <div className="sf-launch-note sf-wrap">
        <span className="sf-kicker">Good to know</span>
        <p>
          We're preparing our first shoppable collection. For now, explore
          custom options and save a design brief. Checkout and online request
          submission are not yet available.
        </p>
      </div>
    </div>
  );
}
