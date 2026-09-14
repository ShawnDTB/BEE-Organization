import { siteConfig } from "../content/siteContent";
export function CustomApparelPage() {
  return (
    <section className="bee-page supporting-page">
      <span className="eyebrow">Custom apparel</span>
      <h1>
        Your idea.
        <br />
        The right canvas.
      </h1>
      <p>
        Start with a garment, a logo, or the purpose behind the project. We can
        discuss embroidery and graphic decoration around the look, use,
        quantity, and budget you have in mind.
      </p>
      <div className="bee-audience-grid">
        <a href="/embroidery">
          <span>Stitched detail</span>
          <h2>Embroidery</h2>
          <p>Explore compact logos and lettering for polos, caps and layers.</p>
          <b>Explore embroidery ↗</b>
        </a>
        <a href="/graphic-apparel">
          <span>Artwork with room</span>
          <h2>Graphic apparel</h2>
          <p>Explore tees, hoodies, colorful designs and larger placements.</p>
          <b>Explore graphic apparel ↗</b>
        </a>
        <a href="/studio">
          <span>A place to experiment</span>
          <h2>Design studio</h2>
          <p>
            Create an approximate mockup. Final files and production details are
            reviewed separately.
          </p>
          <b>Try your idea ↗</b>
        </a>
      </div>
      <div className="bee-final-cta">
        <div>
          <h2>You don’t need a finished design.</h2>
          <p>A rough idea is a good place to begin.</p>
        </div>
        <a className="button" href="/start-order">
          Start a project ↗
        </a>
      </div>
    </section>
  );
}
export function PrivacyPage() {
  return (
    <article className="bee-page supporting-page legal-copy">
      <span className="eyebrow">Your information</span>
      <h1>Project privacy.</h1>
      <p>Works by BEE is the public website of BEE Organization LLC.</p>
      <h2>When you plan a project</h2>
      <p>
        The site stores group size plans, project drafts, contact fields you
        enter, mockup previews, and private notes in your browser so you can
        return to them on the same device. They are not an online account.
        Anyone using that browser profile may be able to access them.
      </p>
      <h2>When you send a request</h2>
      <p>
        If online submission is available, the details shown in the request and
        its attached design previews are sent to BEE for review and follow-up.
        The site asks for your permission before submission. A received
        reference confirms storage; it does not confirm pricing, production,
        payment, or email delivery.
      </p>
      <h2>Files and security checks</h2>
      <p>
        Mockup previews may contain your artwork. Only share files you have
        permission to use. When online requests are enabled, Cloudflare
        Turnstile processes a security check to help prevent automated abuse.
        This site also loads its typefaces through Google Fonts.
      </p>
      <h2>Your copies and choices</h2>
      <p>
        You can download local project copies, delete editable Studio drafts, or
        clear this site’s browser storage to remove local records. Clearing
        browser storage does not delete a request already received by BEE. BEE
        retains submitted project details for review and order follow-up;
        request access, correction, or deletion through the business contact
        handling your project. No fixed retention period is promised here.
      </p>
      {siteConfig.email ? (
        <p>
          Contact: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          .
        </p>
      ) : (
        <p>
          A public business contact address is still being finalized. Online
          submission must remain unavailable until the business has an
          operational process for responding to customer and privacy requests.
        </p>
      )}
      <p>
        Do not include payment card details or sensitive personal information in
        artwork or project notes.
      </p>
    </article>
  );
}
