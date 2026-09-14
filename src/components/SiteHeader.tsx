import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LogoLockup } from "./LogoLockup";
import { navItems } from "../content/siteContent";
import { CART_EVENT, PROJECT_EVENT, readBag } from "../data/projectStore";

export function SiteHeader({ currentPath }: { currentPath: string }) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    const sync = () => setCount(readBag().length);
    sync();
    [CART_EVENT, PROJECT_EVENT, "storage"].forEach((event) =>
      window.addEventListener(event, sync),
    );
    return () =>
      [CART_EVENT, PROJECT_EVENT, "storage"].forEach((event) =>
        window.removeEventListener(event, sync),
      );
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1181px)");
    const resize = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", resize);
    return () => media.removeEventListener("change", resize);
  }, []);
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const html = document.documentElement;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      inset: body.style.inset,
      htmlOverflow: html.style.overflow,
    };
    const scrollY = window.scrollY;
    const modal = dialog.current;
    const opener = trigger.current;
    body.style.overflow = html.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.inset = `-${scrollY}px 0 0`;
    modal?.showModal();
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      modal?.close();
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.inset = previous.inset;
      html.style.overflow = previous.htmlOverflow;
      window.scrollTo({ top: scrollY, behavior: "instant" });
      opener?.focus({ preventScroll: true });
    };
  }, [open]);
  const close = () => setOpen(false);
  const current = (href: string) =>
    currentPath === href ||
    (href === "/bulk-orders" && currentPath === "/schools-organizations");
  const quoteHref =
    currentPath === "/bulk-orders"
      ? "/start-order?type=bulk"
      : currentPath === "/creator-merch"
        ? "/start-order?type=creator"
        : "/start-order";
  return (
    <header className="bee-header">
      <div className="bee-header-inner">
        <LogoLockup />
        <nav className="bee-desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={current(item.href) ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="bee-header-tools">
          <a href="/account">My projects</a>
          <a href="/cart" aria-label={`Project bag, ${count} designs`}>
            Bag{count > 0 && <span>{count}</span>}
          </a>
        </div>
        <a className="button bee-header-quote" href={quoteHref}>
          Request a quote <span aria-hidden="true">↗</span>
        </a>
        <button
          className="bee-menu-trigger"
          ref={trigger}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? id : undefined}
          onClick={() => setOpen(true)}
        >
          Menu <span aria-hidden="true">☰</span>
        </button>
        {open &&
          createPortal(
            <dialog
              id={id}
              ref={dialog}
              className="bee-menu-dialog"
              aria-label="Site navigation"
              onCancel={(e) => {
                e.preventDefault();
                close();
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) close();
              }}
            >
              <div className="bee-menu-panel">
                <div className="bee-menu-heading">
                  <LogoLockup compact />
                  <button
                    ref={closeButton}
                    onClick={close}
                    aria-label="Close navigation"
                  >
                    Close ×
                  </button>
                </div>
                <nav aria-label="Mobile navigation" className="bee-menu-links">
                  <a href="/" onClick={close}>
                    Home
                  </a>
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      aria-current={current(item.href) ? "page" : undefined}
                    >
                      {item.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                  <div className="bee-menu-utilities">
                    <a href="/group-planner" onClick={close}>
                      Group size planner
                    </a>
                    <a href="/studio" onClick={close}>
                      Design studio
                    </a>
                    <a href="/account" onClick={close}>
                      My projects
                    </a>
                    <a href="/cart" onClick={close}>
                      Project bag ({count})
                    </a>
                    <a href="/shop" onClick={close}>
                      Future collections
                    </a>
                  </div>
                  <a className="button" href={quoteHref} onClick={close}>
                    Request a quote
                  </a>
                  <p>Build. Empower. Equip.</p>
                </nav>
              </div>
            </dialog>,
            document.body,
          )}
      </div>
    </header>
  );
}
