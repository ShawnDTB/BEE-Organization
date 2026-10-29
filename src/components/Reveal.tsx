import { useEffect, useRef, useState, type ReactNode } from "react";
import "../styles/reveal.css";

/** Optional editorial motion. Content is visible until enhancement succeeds. */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const element = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"visible" | "pending" | "revealed">(
    "visible",
  );
  const show = useRef<() => void>(() => {});

  useEffect(() => {
    const target = element.current;
    if (
      !target ||
      typeof IntersectionObserver === "undefined" ||
      typeof window.matchMedia !== "function"
    )
      return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Never hide the first view, or an element the visitor already focused.
    if (
      motion.matches ||
      target.contains(document.activeElement) ||
      target.getBoundingClientRect().top < window.innerHeight
    )
      return;

    let observer: IntersectionObserver | undefined;
    let complete = false;
    const reveal = () => {
      if (complete) return;
      complete = true;
      setState("revealed");
      observer?.disconnect();
    };
    show.current = reveal;
    const change = () => {
      if (motion.matches) reveal();
    };
    try {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) reveal();
        },
        { threshold: 0, rootMargin: "0px 0px 48px 0px" },
      );
      observer.observe(target);
      motion.addEventListener("change", change);
      setState("pending");
    } catch {
      observer?.disconnect();
      setState("visible");
    }
    return () => {
      complete = true;
      observer?.disconnect();
      motion.removeEventListener("change", change);
      show.current = () => {};
    };
  }, []);

  return (
    <div
      ref={element}
      className={`reveal ${className}`.trim()}
      data-reveal-state={state}
      onFocusCapture={() => show.current()}
    >
      {children}
    </div>
  );
}
