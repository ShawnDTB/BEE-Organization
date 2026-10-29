import { shopCategories } from "../content/storefront";
import { WorkGallery } from "../components/WorkGallery";
import { CustomStory } from "../components/CustomStory";
import { Reveal } from "../components/Reveal";
import "../styles/home-editorial.css";
const categoryImages: Record<string, string> = {
  "t-shirts": "tee",
  hoodies: "hoodie",
  hats: "cap",
  decals: "decal",
  embroidery: "polo",
};
export function HomePageV4() {
  return (
    <div className="storefront sf-editorial">
      <section className="sf-hero sf-wrap">
        <div className="sf-hero-copy">
          <span className="sf-kicker">
            Works by BEE <span aria-hidden="true">/</span> Custom apparel &
            graphics
          </span>
          <h1>
            Custom gear.
            <br />
            <em>Made personal.</em>
          </h1>
          <p>
            For your people. Your passions. The moments worth making yours.
            Start with a piece. Give it your meaning.
          </p>
          <div className="sf-hero-actions">
            <a className="sf-button" href="/shop">
              Explore the shop <span aria-hidden="true">↗</span>
            </a>
          </div>
          <a className="sf-hero-discover" href="#categories">
            Find your starting point <span aria-hidden="true">↓</span>
          </a>
        </div>
        <figure className="sf-hero-art">
          <div className="sf-editorial-photo">
            <img
              src="/storefront/apparel-study.webp"
              srcSet="/storefront/apparel-study-640.webp 640w, /storefront/apparel-study-960.webp 960w, /storefront/apparel-study.webp 1400w"
              sizes="(max-width: 760px) calc(100vw - 36px), (max-width: 1999px) 50vw, 900px"
              width="1400"
              height="933"
              alt="Apparel design study: a textured charcoal hoodie, a cream T-shirt and a cap with abstract teal graphics"
              fetchPriority="high"
            />
            <span className="sf-photo-index" aria-hidden="true">
              BEE / 001
            </span>
            <span className="sf-photo-statement" aria-hidden="true">
              By you.
              <br />
              With BEE.
            </span>
          </div>
          <figcaption>
            <strong>Something with a little more you.</strong>
            <span>AI-generated design study · Concept apparel</span>
          </figcaption>
        </figure>
      </section>
      <section
        id="categories"
        className="sf-section sf-wrap sf-editorial-categories"
      >
        <div className="sf-section-heading">
          <div>
            <span className="sf-kicker">
              <span aria-hidden="true">01 / </span>Find your starting point
            </span>
            <h2>Pick your piece.</h2>
          </div>
          <a className="sf-text-link" href="/shop">
            Shop all options <span aria-hidden="true">↗</span>
          </a>
        </div>
        <nav className="sf-categories" aria-label="Shop by product type">
          {shopCategories.slice(1).map((category, index) => (
            <a key={category.id} href={`/shop?category=${category.id}`}>
              <span className="sf-category-index" aria-hidden="true">
                0{index + 1}
              </span>
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
      <Reveal>
        <CustomStory />
      </Reveal>
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
