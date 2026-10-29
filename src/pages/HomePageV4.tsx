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
            For your crew, your next chapter, or an idea that feels like you.
            Custom apparel starts with what matters to you.
          </p>
          <div className="sf-hero-actions">
            <a className="sf-button" href="/shop">
              Explore the shop <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <figure className="sf-hero-art">
          <img
            src="/storefront/apparel-study.webp"
            srcSet="/storefront/apparel-study-640.webp 640w, /storefront/apparel-study-960.webp 960w, /storefront/apparel-study.webp 1400w"
            sizes="(max-width: 760px) calc(100vw - 36px), (max-width: 1999px) 50vw, 900px"
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
        <div className="sf-custom-intro">
          <div>
            <span className="sf-kicker">The custom design studio</span>
            <h2 id="custom-heading">Your idea. A piece only you could make.</h2>
            <p>
              A team worth showing up for. A gift with a story. Something
              entirely your own. Try your words and artwork on a garment, then
              shape the details with BEE.
            </p>
          </div>
          <div className="sf-custom-actions">
            <a className="sf-button" href="/studio">
              Create a custom design <span aria-hidden="true">↗</span>
            </a>
            <a className="sf-text-link" href="/start-order">
              Have BEE help with my idea <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <ol
          className="sf-custom-steps"
          aria-label="How a custom piece takes shape"
        >
          <li>
            <span aria-hidden="true">01</span>
            <div>
              <h3>Pick your piece.</h3>
              <p>Start with a T-shirt, hoodie, or polo.</p>
            </div>
          </li>
          <li>
            <span aria-hidden="true">02</span>
            <div>
              <h3>Make it personal.</h3>
              <p>Add artwork, words, or a rough idea.</p>
            </div>
          </li>
          <li>
            <span aria-hidden="true">03</span>
            <div>
              <h3>Review it together.</h3>
              <p>Confirm the design and quote before paying.</p>
            </div>
          </li>
        </ol>
        <p className="sf-custom-reassurance">
          Explore freely. Studio saves a concept on this device; it does not
          place an order or take payment.
        </p>
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
