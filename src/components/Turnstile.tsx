import { useEffect, useRef, useState } from "react";
type Widget = {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  remove(id: string): void;
};
declare global {
  interface Window {
    turnstile?: Widget;
  }
}
let scriptPromise: Promise<void> | undefined;
function loadScript() {
  if (window.turnstile) return Promise.resolve();
  return (scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = undefined;
      script.remove();
      reject(new Error("Security check could not load."));
    };
    document.head.append(script);
  }));
}
export function Turnstile({
  siteKey,
  onToken,
  attempt,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  attempt: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  callback.current = onToken;
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let id: string | undefined;
    setError("");
    loadScript()
      .then(() => {
        if (active && container.current)
          id = window.turnstile?.render(container.current, {
            sitekey: siteKey,
            action: "quote",
            theme: "dark",
            callback: (value: string) => callback.current(value),
            "expired-callback": () => callback.current(""),
            "error-callback": () => {
              callback.current("");
              setError(
                "The security check needs another try. Reload this page; your saved draft will remain.",
              );
            },
          });
      })
      .catch(() => {
        if (active)
          setError(
            "Security check could not load. Check your connection and reload.",
          );
      });
    return () => {
      active = false;
      if (id) window.turnstile?.remove(id);
    };
  }, [siteKey, attempt]);
  return (
    <div>
      <div ref={container} />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
