import { useEffect, useState } from "react";
import { findStoreProduct, type StoreProduct } from "../content/storeContent";
import {
  CART_EVENT,
  PROJECT_EVENT,
  getDraft,
  readBag,
  saveBag,
  updateBagQuantity,
  type ProjectBagItem,
} from "../data/projectStore";

export type { ProjectBagItem } from "../data/projectStore";
export {
  CART_EVENT,
  CART_KEY,
  readBag as safeReadBag,
} from "../data/projectStore";

function StudioLink({
  item,
  product,
}: {
  item: ProjectBagItem;
  product: StoreProduct;
}) {
  const garment = product.image.includes("hoodie")
    ? "hoodie"
    : product.image.includes("polo")
      ? "polo"
      : "tee";
  return (
    <a
      className="text-link"
      href={
        item.draftId
          ? `/studio?draft=${encodeURIComponent(item.draftId)}`
          : `/studio?garment=${garment}`
      }
    >
      {item.draftId ? "Edit exact design →" : "Edit in Studio →"}
    </a>
  );
}

export function CartPage() {
  const [items, setItems] = useState<ProjectBagItem[]>(readBag);

  useEffect(() => {
    const sync = () => setItems(readBag());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener(PROJECT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener(PROJECT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function updateQuantity(id: string, quantity: number) {
    try {
      updateBagQuantity(id, quantity);
      setItems(readBag());
    } catch {
      /* Global storage notice. */
    }
  }

  function removeItem(id: string) {
    const next = items.filter((item) => item.id !== id);
    try {
      saveBag(next);
      setItems(next);
    } catch {
      /* Global storage notice. */
    }
  }

  const totalPieces = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="project-bag-page">
      <header className="workspace-heading">
        <div>
          <span className="eyebrow">Project bag</span>
          <h1>Your custom pieces for this request.</h1>
        </div>
        <p>
          {items.length === 0
            ? "Nothing configured yet."
            : `${items.length} design${items.length === 1 ? "" : "s"} · ${totalPieces} estimated piece${totalPieces === 1 ? "" : "s"}`}
        </p>
      </header>
      {items.length === 0 ? (
        <div className="clean-empty-state">
          <span>No project items</span>
          <h2>Start in Studio.</h2>
          <p>
            Save a mockup and it will stay connected through project review.
          </p>
          <a className="button" href="/studio">
            Open BEE Studio
          </a>
        </div>
      ) : (
        <div className="project-bag-layout">
          <div className="project-bag-items">
            {items.map((item) => {
              const product = findStoreProduct(item.productSlug);
              if (!product) return null;
              const draft = getDraft(item.draftId);
              return (
                <article className="project-bag-item" key={item.id}>
                  <div className="project-item-visual">
                    {draft?.artworkData ? (
                      <img src={draft.artworkData} alt="Your saved artwork" />
                    ) : (
                      <img src={product.image} alt="Garment reference" />
                    )}
                    {draft?.text && (
                      <strong style={{ color: draft.textColor }}>
                        {draft.text}
                      </strong>
                    )}
                  </div>
                  <div className="project-bag-item__copy">
                    <span>
                      {draft ? "Saved Studio design" : product.category}
                    </span>
                    <h2>{draft?.name || product.name}</h2>
                    <dl>
                      <div>
                        <dt>Garment</dt>
                        <dd>{product.name}</dd>
                      </div>
                      <div>
                        <dt>Color</dt>
                        <dd>{item.color}</dd>
                      </div>
                      <div>
                        <dt>Size</dt>
                        <dd>{item.size}</dd>
                      </div>
                      <div>
                        <dt>Decoration</dt>
                        <dd>{item.decoration}</dd>
                      </div>
                    </dl>
                    <div className="project-bag-item__actions">
                      <label>
                        Estimated quantity
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(item.id, Number(event.target.value))
                          }
                        />
                      </label>
                      <StudioLink item={item} product={product} />
                      <button type="button" onClick={() => removeItem(item.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <aside className="project-bag-summary">
            <span className="eyebrow">Next</span>
            <h2>Add the project details.</h2>
            <dl>
              <div>
                <dt>Designs</dt>
                <dd>{items.length}</dd>
              </div>
              <div>
                <dt>Estimated pieces</dt>
                <dd>{totalPieces}</dd>
              </div>
              <div>
                <dt>Pricing</dt>
                <dd>Prepared after review</dd>
              </div>
            </dl>
            <p>No payment or production commitment happens here.</p>
            <a className="button" href="/project-review">
              Continue to project review
            </a>
            <a className="text-link" href="/studio">
              Add another design →
            </a>
          </aside>
        </div>
      )}
    </section>
  );
}

export { StartOrderPage as ProjectReviewPage } from "./StartOrderPage";

export function RetailCheckoutPage() {
  return (
    <section className="clean-empty-state clean-empty-state--page">
      <span>Retail checkout</span>
      <h1>Checkout activates when finished merchandise is available.</h1>
      <p>
        Published Shop products will use price, cart, payment, shipping, and
        order confirmation. Custom work uses Project Review.
      </p>
      <div>
        <a className="button" href="/shop">
          Return to Shop
        </a>
        <a className="text-link" href="/studio">
          Design custom apparel →
        </a>
      </div>
    </section>
  );
}
