import { shopCategories, plannedCollections } from "../content/storefront";
import { WorkGallery } from "../components/WorkGallery";
export function HomePageV4() {
  return (
    <div className="storefront">
      <div className="sf-announcement">
        A fresh look for your next idea.{" "}
        <span>Shop preview · Online checkout coming soon</span>
      </div>
      <section className="sf-hero sf-wrap">
        <div className="sf-hero-copy">
          <span className="sf-kicker">
            Works by BEE · Custom apparel & more
          </span>
          <h1>
            A little you.
            <br />A lot of <em>possibility.</em>
          </h1>
          <p>
            T-shirts, hats, embroidery, and ideas worth wearing. Find your
            starting point. Make it your own.
          </p>
          <a className="sf-button" href="/shop">
            Explore the shop <span aria-hidden="true">↗</span>
          </a>
          <a className="sf-text-link" href="#categories">
            What can I make? <span aria-hidden="true">↓</span>
          </a>
        </div>
        <figure className="sf-hero-art">
          <div className="sf-art-heading">
            <span>YOUR IDEA STARTS HERE</span>
            <span aria-hidden="true">✳</span>
          </div>
          <img
            className="sf-hero-hoodie"
            src="/storefront/hoodie.svg"
            width="800"
            height="980"
            alt="Illustrated charcoal hoodie with a teal design area"
            fetchPriority="high"
          />
          <img
            className="sf-hero-tee"
            src="/storefront/tee.svg"
            width="800"
            height="980"
            alt=""
          />
          <img
            className="sf-hero-cap"
            src="/storefront/cap.svg"
            width="800"
            height="980"
            alt=""
          />
          <figcaption>
            <strong>Wear what makes you, you.</strong>
            <span>Illustrations for inspiration · Not finished products</span>
          </figcaption>
        </figure>
      </section>
      <section id="categories" className="sf-section sf-wrap">
        <div className="sf-section-heading">
          <div>
            <span className="sf-kicker">One simple place to start</span>
            <h2>What do you have in mind?</h2>
          </div>
          <a className="sf-text-link" href="/shop">
            View all options <span aria-hidden="true">↗</span>
          </a>
        </div>
        <nav className="sf-categories" aria-label="Shop by product type">
          {shopCategories.slice(1).map((category, index) => (
            <a key={category.id} href={`/shop?category=${category.id}`}>
              <span className="sf-category-number">0{index + 1}</span>
              <strong>{category.label}</strong>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </section>
      <section className="sf-about sf-wrap" aria-labelledby="about-bee">
        <div>
          <span className="sf-kicker">A little about BEE</span>
          <h2 id="about-bee">
            Your interests.
            <br />
            Your people. <em>Your style.</em>
          </h2>
        </div>
        <div>
          <p>
            Something for yourself, a gift with meaning, or a look for the whole
            crew. Works by BEE brings personal ideas to custom apparel and
            embroidery.
          </p>
          <p>You bring the idea. We work through the details together.</p>
          <a className="sf-text-link" href="/start-order">
            Plan a custom piece <span aria-hidden="true">↗</span>
          </a>
          <small>
            The planner saves your idea. It does not place an order.
          </small>
        </div>
      </section>
      <WorkGallery />
      <section
        className="sf-section sf-wrap sf-coming"
        aria-labelledby="collections-heading"
      >
        <div className="sf-section-heading">
          <div>
            <span className="sf-kicker">On the drawing board</span>
            <h2 id="collections-heading">Made for what you're into.</h2>
          </div>
          <p>
            Collections in the works.
            <br />
            Designs and release dates to come.
          </p>
        </div>
        <ul>
          {plannedCollections.map((name) => (
            <li key={name}>
              {name}
              <span>Coming later</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
