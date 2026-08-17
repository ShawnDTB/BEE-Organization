export function ShopV2Page() {
  return (
    <section className="shop-v3 shop-v3--concise">
      <section className="shop-v3__feature">
        <div className="shop-v3__copy">
          <span className="eyebrow">Finished merchandise</span>
          <h1>Shop the work that is ready to wear.</h1>
          <p>Creator drops, BEE originals, and organization collections will live here once they are finished, approved, and available to buy.</p>
          <div className="shop-v3__feature-actions">
            <a className="button" href="/studio">Design something custom</a>
            <a className="text-link" href="/creator-merch">Planning creator merch? →</a>
          </div>
        </div>
        <div className="shop-v3__media">
          <img src="/store/hoodie.svg" alt="Heavyweight hoodie development visual" />
          <div><span>Collections</span><b>Real finished merchandise only</b></div>
        </div>
      </section>

      <section className="shop-v3__catalog shop-v3__catalog--concise">
        <header>
          <div><span className="eyebrow">Current shop</span><h2>Nothing published yet.</h2></div>
          <p>BEE is still preparing its first sale. When the first real collection is ready, the products appear here—without placeholder listings.</p>
        </header>

        <div className="shop-v3__empty shop-v3__empty--actionable">
          <div>
            <strong>Need apparel now?</strong>
            <p>Start with a blank garment in Studio and build the custom piece around your artwork, group, or idea.</p>
            <a className="button" href="/studio">Open BEE Studio</a>
          </div>
          <div className="shop-v3__studio-options" aria-label="Start a custom garment">
            <a href="/studio?garment=tee"><img src="/store/tee.svg" alt="" /><span>Tee</span></a>
            <a href="/studio?garment=hoodie"><img src="/store/hoodie.svg" alt="" /><span>Hoodie</span></a>
            <a href="/studio?garment=polo"><img src="/store/polo.svg" alt="" /><span>Polo</span></a>
          </div>
        </div>
      </section>
    </section>
  );
}
