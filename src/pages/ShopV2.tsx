import { useEffect, useState } from "react";
import {
  parseCategory,
  planningHref,
  shopCategories,
  shopOptions,
  studioHref,
  type ShopCategory,
} from "../content/storefront";
export function ShopV2Page() {
  const [category, setCategory] = useState(() =>
    parseCategory(new URLSearchParams(window.location.search).get("category")),
  );
  useEffect(() => {
    const sync = () =>
      setCategory(
        parseCategory(
          new URLSearchParams(window.location.search).get("category"),
        ),
      );
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  function selectCategory(next: ShopCategory) {
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.pushState(null, "", url);
    setCategory(next);
  }
  const options = shopOptions.filter(
    (option) => category === "all" || option.category === category,
  );
  return (
    <div className="storefront sf-shop">
      <section className="sf-shop-intro sf-wrap">
        <div className="sf-shop-title">
          <div>
            <span className="sf-kicker">Custom apparel & graphics</span>
            <h1>Start with a piece. Make it yours.</h1>
          </div>
          <p>
            Your team, your artwork, your story. Choose the starting point for
            your custom piece.
          </p>
        </div>
        <aside className="sf-shop-notice" aria-label="Shop availability">
          <strong>Collection in progress</strong>
          <p>Explore custom options. Prices and checkout are being prepared.</p>
        </aside>
      </section>
      <section className="sf-catalog sf-wrap" aria-labelledby="catalog-heading">
        <h2 id="catalog-heading" className="sf-catalog-label">
          Choose your base
        </h2>
        <div
          className="sf-filters"
          role="group"
          aria-label="Filter product options"
        >
          {shopCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={category === item.id}
              onClick={() => selectCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="sf-result-count" role="status" aria-live="polite">
          {options.length} {options.length === 1 ? "option" : "options"} to
          explore · {shopCategories.find((item) => item.id === category)?.label}
        </p>
        <div className="sf-product-grid">
          {options.map((option) => (
            <article key={option.id} className="sf-product">
              <div className="sf-product-media">
                <img
                  src={`/storefront/${option.image}.svg`}
                  width="800"
                  height="980"
                  alt={`Illustration of ${option.garment.toLowerCase()}`}
                  loading="lazy"
                  decoding="async"
                />
                <span>
                  {option.id === "decal" ? "Planned category" : "Custom idea"}
                </span>
              </div>
              <div className="sf-product-copy">
                <span className="sf-kicker">
                  {
                    shopCategories.find((item) => item.id === option.category)
                      ?.label
                  }
                </span>
                <h3>{option.name}</h3>
                <p>{option.description}</p>
                <details>
                  <summary>What to know</summary>
                  <p>{option.detail}</p>
                </details>
                {studioHref(option) ? (
                  <div className="sf-product-actions">
                    <a className="sf-product-link" href={studioHref(option)!}>
                      {option.id === "tee"
                        ? "Design a custom T-shirt"
                        : option.id === "hoodie"
                          ? "Design a custom hoodie"
                          : "Design a custom polo"}
                      <span aria-hidden="true">↗</span>
                    </a>
                    <a
                      className="sf-product-assist"
                      href={planningHref(option)}
                      aria-label={`Ask BEE for help with ${option.garment.toLowerCase()}`}
                    >
                      Ask BEE for help
                    </a>
                  </div>
                ) : (
                  <a className="sf-product-link" href={planningHref(option)}>
                    Plan {option.garment.toLowerCase()}{" "}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        <p className="sf-catalog-note">
          Illustrations show product types, not completed BEE work. Designs and
          briefs save on this device; they do not submit or pay for an order.
        </p>
      </section>
      <section
        className="sf-help sf-wrap"
        aria-labelledby="studio-entry-heading"
      >
        <div>
          <span className="sf-kicker">Made for custom</span>
          <h2 id="studio-entry-heading">Start with the idea you have.</h2>
          <p>
            Try words and artwork on a garment in the design studio, or describe
            your idea in the planner. No finished artwork needed.
          </p>
        </div>
        <div className="sf-custom-actions">
          <a className="sf-button" href="/studio">
            Open the design studio <span aria-hidden="true">↗</span>
          </a>
          <a className="sf-text-link" href="/start-order">
            Describe my idea instead <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
      <section
        className="sf-order-expectations sf-wrap"
        aria-labelledby="custom-process-heading"
      >
        <h2 id="custom-process-heading">
          Your idea comes first. Commitment comes after review.
        </h2>
        <p>
          For custom work, the garment, artwork, quantity, price, and timing
          need to be confirmed together. A saved concept is the starting point;
          an approved proof is what guides production.
        </p>
      </section>
    </div>
  );
}
