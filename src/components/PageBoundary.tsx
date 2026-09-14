import { Component, type ReactNode } from "react";
export class PageBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <section className="bee-page supporting-page" role="alert">
        <span className="eyebrow">Let’s try that again</span>
        <h1>This page couldn’t open.</h1>
        <p>
          A connection or saved-data problem interrupted the page. Your existing
          saved drafts have not been cleared.
        </p>
        <div className="bee-actions">
          <button className="button" onClick={() => window.location.reload()}>
            Reload page
          </button>
          <a href="/">Return home →</a>
        </div>
      </section>
    ) : (
      this.props.children
    );
  }
}
