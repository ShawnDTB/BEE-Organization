export function ShopV2Page() {
  return (
    <section className="shop-v3 shop-v3--concise">
      <section className="shop-v3__feature">
        <div className="shop-v3__copy">
          <span className="eyebrow">Shop</span>
          <h1>Creator drops, BEE pieces, and group stores.</h1>
          <p>This page only shows merchandise that is ready to buy. Nothing is published yet.</p>
          <div className="shop-v3__feature-actions">
            <a className="button" href="/studio">Design custom apparel</a>
            <a className="text-link" href="/creator-merch">Plan creator merch →</a>
          </div>
        </div>
        <div className="shop-v3__media">
          <img src="/store/hoodie.svg" alt="Heavyweight hoodie development visual" />
          <div><span>Shop preview</span><b>Finished merchandise</b></div>
        </div>
      </section>

      <section className="shop-v3__studio shop-v3__studio--prelaunch">
        <div>
          <span className="eyebrow">Need something custom?</span>
          <h2>Start with a blank garment.</h2>
          <p>Choose a tee, hoodie, or polo, then add your artwork and placement in Studio.</p>
          <a className="button" href="/studio">Open BEE Studio</a>
        </div>
        <div className="shop-v3__studio-options" aria-label="Start a custom garment">
          <a href="/studio?garment=tee"><img src="/store/tee.svg" alt="" /><span>Tee</span></a>
          <a href="/studio?garment=hoodie"><img src="/store/hoodie.svg" alt="" /><span>Hoodie</span></a>
          <a href="/studio?garment=polo"><img src="/store/polo.svg" alt="" /><span>Polo</span></a>
        </div>
      </section>
    </section>
  );
}
