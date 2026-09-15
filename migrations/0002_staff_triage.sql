-- Review state is an append-only event history, separate from original requests.
CREATE TABLE IF NOT EXISTS request_events (
  event_id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES quote_requests(request_id) ON DELETE CASCADE,
  version INTEGER NOT NULL CHECK(version > 0),
  status TEXT NOT NULL CHECK(status IN ('new','reviewing','needs-details','ready-to-quote','archived')),
  note TEXT NOT NULL CHECK(length(note) <= 2000),
  actor_subject TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(request_id, version)
);
CREATE INDEX IF NOT EXISTS request_events_latest ON request_events(request_id, version DESC);
CREATE TRIGGER IF NOT EXISTS request_events_immutable BEFORE UPDATE ON request_events
BEGIN SELECT RAISE(ABORT, 'Review events cannot be edited'); END;
