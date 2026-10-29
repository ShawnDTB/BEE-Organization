import { useEffect, useState } from "react";
import {
  parseCategory,
  planningHref,
  shopCategories,
  shopOptions,
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
        <a className="sf-breadcrumb" href="/">
          Home <span aria-hidden="true">/</span>
        </a>
        <span className="sf-breadcrumb-current">Shop</span>
        <div className="sf-shop-title">
          <div>
            <span className="sf-kicker">Custom apparel & graphics</span>
            <h1>Find your next favorite.</h1>
          </div>
          <p>
            Choose your piece. Bring your artwork.
            <br />
            We'll work through the details together.
          </p>
        </div>
        <aside className="sf-shop-notice" aria-label="Shop availability">
          <strong>Custom options / Collection in progress</strong>
          <p>
            Explore product types and plan a custom piece. Finished designs,
            prices, and checkout are being prepared.
          </p>
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
                <a className="sf-product-link" href={planningHref(option)}>
                  Plan {option.garment.toLowerCase()}{" "}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="sf-catalog-note">
          Illustrations show product types, not completed BEE work. Saving an
          idea opens the planner; it does not submit or pay for an order.
        </p>
      </section>
      <section className="sf-help sf-wrap">
        <div>
          <span className="sf-kicker">Something else in mind?</span>
          <h2>Start with the idea you have.</h2>
          <p>
            A few words are enough to begin. Save the details in the
            custom-order planner and come back when you're ready.
          </p>
        </div>
        <a className="sf-button" href="/start-order">
          Open the planner <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  );
}
