import { useEffect, useState } from "react";
import {
  PROJECT_EVENT,
  readProjects,
  readDrafts,
  readProjectNotes,
  saveProjectNote,
  deleteStudioDraft,
  duplicateStudioDraft,
  reorderProject,
  saveProjectDraft,
  readBag,
  saveBag,
  saveStudioDraft,
  type BeeProject,
  hasCurrentProjectDraft,
  deleteProjectCopy,
} from "../data/projectStore";
import { downloadText } from "../data/download";
import { projectBrief } from "../data/projectBrief";

export function AccountPageV4() {
  const [projects, setProjects] = useState(readProjects);
  const [drafts, setDrafts] = useState(readDrafts);
  const [notes, setNotes] = useState(readProjectNotes);
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [currentDraft, setCurrentDraft] = useState(hasCurrentProjectDraft);
  useEffect(() => {
    const sync = () => {
      setProjects(readProjects());
      setDrafts(readDrafts());
      setNotes(readProjectNotes());
      setCurrentDraft(hasCurrentProjectDraft());
    };
    [PROJECT_EVENT, "storage", "focus"].forEach((event) =>
      window.addEventListener(event, sync),
    );
    return () =>
      [PROJECT_EVENT, "storage", "focus"].forEach((event) =>
        window.removeEventListener(event, sync),
      );
  }, []);
  const project = projects.find((p) => p.id === selected) || projects[0];
  const received = projects.filter((p) => p.delivery === "received");
  const action = (callback: () => void) => {
    try {
      callback();
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  };
  function resume(p: BeeProject) {
    if (readBag().length) {
      setError(
        "Your project bag already has designs. Review it before opening another project.",
      );
      return;
    }
    action(() => {
      saveProjectDraft(p.intake);
      const copies = (p.snapshotItems || []).map((item) => {
        const id = `studio-${crypto.randomUUID()}`;
        if (item.design)
          saveStudioDraft({
            ...item.design,
            id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        return { ...item, id, draftId: item.design ? id : undefined };
      });
      saveBag(copies);
      window.location.assign("/start-order");
    });
  }
  return (
    <section className="bee-page workspace">
      <header className="workspace-title">
        <div>
          <span className="eyebrow">My projects</span>
          <h1>
            From first idea
            <br />
            to the next order.
          </h1>
          <p>
            Your designs and request copies on this device. Live account access
            and production updates are not connected yet.
          </p>
        </div>
        <a className="button" href="/start-order">
          New project ↗
        </a>
      </header>
      {currentDraft && (
        <aside className="availability-note">
          <strong>Your current request is saved here.</strong>
          <p>
            Pick up the details you last entered. It has not been sent to BEE.
          </p>
          <a className="text-link" href="/start-order">
            Continue current request →
          </a>
        </aside>
      )}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <div className="workspace-metrics">
        <article>
          <span>Saved designs</span>
          <strong>{drafts.length}</strong>
        </article>
        <article>
          <span>Requests recorded by BEE</span>
          <strong>{received.length}</strong>
        </article>
        <article>
          <span>Unsent project drafts</span>
          <strong>{projects.length - received.length}</strong>
        </article>
      </div>
      <div className="workspace-layout">
        <aside className="workspace-projects">
          <h2>Project history</h2>
          {projects.length === 0 ? (
            <p>No projects yet. Start a request or save a design in Studio.</p>
          ) : (
            projects.map((p) => (
              <button
                key={p.id}
                aria-pressed={project?.id === p.id}
                onClick={() => {
                  setSelected(p.id);
                  setNote("");
                }}
              >
                <small>
                  {p.delivery === "received"
                    ? "Request received"
                    : "Draft · not sent"}
                </small>
                <strong>{p.title}</strong>
                <span>{new Date(p.createdAt).toLocaleDateString()}</span>
              </button>
            ))
          )}
        </aside>
        <div className="workspace-detail">
          {project ? (
            <>
              <div className="workspace-detail-heading">
                <span className="eyebrow">
                  {project.delivery === "received"
                    ? "Awaiting BEE review"
                    : "Your next step"}
                </span>
                <h2>{project.title}</h2>
                <p>
                  {project.delivery === "received"
                    ? "BEE has your original request. Contact and production updates will be arranged separately."
                    : "Review this draft and submit it when online requests become available."}
                </p>
                <code>{project.reference}</code>
              </div>
              <dl>
                <div>
                  <dt>Garment / item</dt>
                  <dd>{project.intake.garment || "To be discussed"}</dd>
                </div>
                <div>
                  <dt>Estimated quantity</dt>
                  <dd>
                    {project.intake.quantity ||
                      project.items.reduce((n, item) => n + item.quantity, 0) ||
                      "To be discussed"}
                  </dd>
                </div>
                <div>
                  <dt>Need-by date</dt>
                  <dd>{project.intake.deadline || "Not set"}</dd>
                </div>
              </dl>
              <div className="bee-actions">
                <button
                  onClick={() =>
                    downloadText(
                      "BEE-project-brief.txt",
                      projectBrief(
                        project.intake,
                        project.snapshotItems || [],
                        project.delivery === "received"
                          ? {
                              reference: project.reference,
                              receivedAt: project.submittedAt,
                            }
                          : null,
                      ),
                    )
                  }
                >
                  Download readable brief
                </button>
                <button
                  className="button"
                  onClick={() =>
                    project.delivery === "received"
                      ? action(() => {
                          reorderProject(project);
                          window.location.assign("/cart");
                        })
                      : resume(project)
                  }
                >
                  {project.delivery === "received"
                    ? "Start a similar request"
                    : "Continue this draft"}
                </button>
                <button
                  onClick={() =>
                    downloadText(
                      `BEE-${project.id}.json`,
                      JSON.stringify(project, null, 2),
                      "application/json",
                    )
                  }
                >
                  Download project copy
                </button>
              </div>
              <button onClick={() => setDeleteProjectId(project.id)}>
                Remove this local project copy
              </button>
              {deleteProjectId === project.id && (
                <div
                  className="delete-confirm"
                  role="group"
                  aria-label="Confirm local project removal"
                >
                  <p>
                    Remove this saved copy and its local notes? Studio designs
                    and any request already received by BEE remain unchanged.
                    Download a copy first if needed.
                  </p>
                  <button
                    onClick={() =>
                      action(() => {
                        deleteProjectCopy(project.id);
                        setDeleteProjectId(null);
                        setSelected(null);
                      })
                    }
                  >
                    Remove local copy
                  </button>
                  <button onClick={() => setDeleteProjectId(null)}>
                    Keep project
                  </button>
                </div>
              )}
              <p className="workspace-small">
                {project.delivery === "received"
                  ? "A similar request is a new quote. Garments, timing and pricing need to be confirmed again."
                  : "Older drafts may not include a design snapshot. Review attached designs before submitting."}
              </p>
              <section className="workspace-notes">
                <h3>Notes to keep with this project</h3>
                <p>
                  These are private notes on this device. They are not sent to
                  BEE.
                </p>
                {notes
                  .filter((n) => n.projectId === project.id)
                  .map((n) => (
                    <article key={n.id}>
                      <p>{n.body}</p>
                      <small>{new Date(n.createdAt).toLocaleString()}</small>
                    </article>
                  ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    action(() => {
                      saveProjectNote(project.id, note);
                      setNote("");
                    });
                  }}
                >
                  <label>
                    Project note
                    <textarea
                      rows={3}
                      maxLength={4000}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </label>
                  <button disabled={!note.trim()} type="submit">
                    Save note
                  </button>
                </form>
              </section>
            </>
          ) : (
            <div className="workspace-empty">
              <span className="eyebrow">A place to begin</span>
              <h2>Your next idea belongs here.</h2>
              <p>
                Build a mockup, gather the project details, and keep a copy for
                your next conversation with BEE.
              </p>
              <div className="bee-actions">
                <a className="button" href="/start-order">
                  Plan a project
                </a>
                <a href="/studio">Try the design studio →</a>
              </div>
            </div>
          )}
        </div>
      </div>
      <section className="workspace-designs">
        <div>
          <span className="eyebrow">Your design bench</span>
          <h2>Pick up where you left off.</h2>
        </div>
        <a href="/studio">Create a design →</a>
        <div className="saved-design-grid">
          {drafts.length === 0 ? (
            <p>Your saved Studio mockups will appear here.</p>
          ) : (
            drafts.map((d) => (
              <article key={d.id}>
                <div className="saved-design-art">
                  {d.artworkData ? (
                    <img src={d.artworkData} alt="Saved artwork" />
                  ) : (
                    <strong style={{ color: d.textColor }}>
                      {d.text || "Your design"}
                    </strong>
                  )}
                </div>
                <small>
                  {d.garment} · {d.decoration}
                </small>
                <h3>{d.name}</h3>
                <p>
                  {d.quantity} pieces · {d.size}
                </p>
                <div className="bee-actions">
                  <a href={`/studio?draft=${encodeURIComponent(d.id)}`}>
                    Edit design ↗
                  </a>
                  <button
                    onClick={() =>
                      action(() => {
                        duplicateStudioDraft(d.id);
                      })
                    }
                  >
                    Duplicate
                  </button>
                  <button onClick={() => setDeleteId(d.id)}>Delete</button>
                </div>
                {deleteId === d.id && (
                  <div
                    className="delete-confirm"
                    role="group"
                    aria-label="Confirm draft deletion"
                  >
                    <p>
                      Delete this editable draft? Existing project snapshots are
                      kept.
                    </p>
                    <button
                      onClick={() =>
                        action(() => {
                          deleteStudioDraft(d.id);
                          setDeleteId(null);
                        })
                      }
                    >
                      Delete draft
                    </button>
                    <button onClick={() => setDeleteId(null)}>Keep it</button>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </section>
      <p className="workspace-small">
        Clearing browser data removes these local copies. Download important
        work. Request copies downloaded here are not quotes, invoices, proof
        approvals, or payment receipts.
      </p>
    </section>
  );
}
