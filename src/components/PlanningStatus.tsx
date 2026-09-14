import { useEffect, useState } from "react";
export function PlanningStatus() {
  const [state, setState] = useState<"checking" | "open" | "planning">(
    "checking",
  );
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      controller.abort();
      setState("planning");
    }, 8000);
    fetch("/api/intake/status", { signal: controller.signal })
      .then(async (response) => {
        if (
          !response.ok ||
          !response.headers.get("content-type")?.includes("application/json")
        )
          throw new Error();
        return response.json();
      })
      .then((data) => setState(data.enabled === true ? "open" : "planning"))
      .catch(() => {
        if (!controller.signal.aborted) setState("planning");
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);
  if (state !== "planning") return null;
  return (
    <aside className="planning-status">
      <span>
        Plan your project today. Online request submission is not currently
        available.
      </span>
      <a href="/start-order">Save a project brief →</a>
    </aside>
  );
}
