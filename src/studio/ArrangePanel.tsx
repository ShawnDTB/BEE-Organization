import { useState } from "react";
import type { StudioLayer } from "../../shared/studio";
import { arrangeLayers, type ArrangeAction } from "./geometry";
export function ArrangePanel({
  layers,
  onApply,
}: {
  layers: StudioLayer[];
  onApply: (layers: StudioLayer[]) => void;
}) {
  const [ids, setIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const selectable = layers.filter((l) => !l.hidden && !l.locked);
  const chosen = ids.filter((id) => selectable.some((l) => l.id === id));
  function apply(action: ArrangeAction) {
    try {
      onApply(arrangeLayers(layers, chosen, action));
      setMessage(
        "Arrangement applied. Use Undo to restore the previous positions.",
      );
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  return (
    <details className="bee-arrange">
      <summary>Arrange multiple elements</summary>
      <p>
        Select elements here to align them together. Locked and hidden elements
        stay in place.
      </p>
      <div className="bee-tool-buttons">
        <button onClick={() => setIds(selectable.map((l) => l.id))}>
          Select all editable
        </button>
        <button onClick={() => setIds([])}>Clear selection</button>
      </div>
      {selectable.map((l, i) => (
        <label className="bee-arrange-choice" key={l.id}>
          <input
            type="checkbox"
            checked={chosen.includes(l.id)}
            onChange={(e) =>
              setIds(
                e.target.checked
                  ? [...chosen, l.id]
                  : chosen.filter((id) => id !== l.id),
              )
            }
          />
          {l.kind === "text"
            ? l.text || "Empty text"
            : `${l.kind === "image" ? "Artwork" : l.kind} ${i + 1}`}
        </label>
      ))}
      <p>
        {chosen.length} selected · alignment uses the selection’s outer bounds.
      </p>
      <div className="bee-tool-buttons">
        {(
          [
            ["board-center", "Center selection on board"],
            ["left", "Align left"],
            ["horizontal", "Align horizontal centers"],
            ["right", "Align right"],
            ["top", "Align top"],
            ["vertical", "Align vertical centers"],
            ["bottom", "Align bottom"],
            ["space-x", "Equal horizontal spacing"],
            ["space-y", "Equal vertical spacing"],
          ] as [ArrangeAction, string][]
        ).map(([action, label]) => (
          <button
            key={action}
            disabled={
              chosen.length <
              (action.startsWith("space-")
                ? 3
                : action === "board-center"
                  ? 1
                  : 2)
            }
            onClick={() => apply(action)}
          >
            {label}
          </button>
        ))}
      </div>
      <p role="status">{message}</p>
    </details>
  );
}
