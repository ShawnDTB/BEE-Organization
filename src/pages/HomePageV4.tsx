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
          <p>Custom T-shirts, hoodies, hats, and details that make it yours.</p>
          <div className="sf-hero-actions">
            <a className="sf-button" href="/shop">
              Explore the shop <span aria-hidden="true">↗</span>
            </a>
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
            Shop all options <span aria-hidden="true">↗</span>
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
      <section
        className="sf-custom-callout sf-wrap"
        aria-labelledby="custom-heading"
      >
        <div>
          <span className="sf-kicker">Custom by BEE</span>
          <h2 id="custom-heading">Have something in mind?</h2>
          <p>
            Bring your artwork or a rough idea. We'll work through the details
            together.
          </p>
        </div>
        <a className="sf-button" href="/start-order">
          Plan a custom piece <span aria-hidden="true">↗</span>
        </a>
      </section>
      <WorkGallery />
      <div className="sf-launch-note sf-wrap">
        <span className="sf-kicker">Good to know</span>
        <p>
          The collection is being prepared. Explore options and save a brief;
          checkout and online request submission are not yet available.
        </p>
      </div>
    </div>
  );
}
