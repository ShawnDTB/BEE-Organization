import { useEffect, useState } from "react";
import { STORAGE_EVENT } from "../data/projectStore";
export function StorageNotice() {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const warn = () => setFailed(true);
    window.addEventListener(STORAGE_EVENT, warn);
    return () => window.removeEventListener(STORAGE_EVENT, warn);
  }, []);
  return failed ? (
    <div className="storage-notice" role="alert">
      Your browser could not save the latest changes. Keep this page open and
      download your request or design before leaving.
      <button
        onClick={() => setFailed(false)}
        aria-label="Dismiss storage notice"
      >
        ×
      </button>
    </div>
  ) : null;
}
