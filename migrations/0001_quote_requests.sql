-- Original request snapshots are immutable. Revisions must be new requests.
CREATE TABLE IF NOT EXISTS quote_requests (
  request_id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  fingerprint TEXT NOT NULL,
  received_at TEXT NOT NULL,
  snapshot_json TEXT NOT NULL CHECK(json_valid(snapshot_json))
);
CREATE INDEX IF NOT EXISTS quote_requests_received ON quote_requests(received_at DESC);
CREATE TRIGGER IF NOT EXISTS quote_requests_immutable BEFORE UPDATE ON quote_requests
BEGIN SELECT RAISE(ABORT, 'Original request snapshots cannot be edited'); END;
-- Deletion remains available to the database operator for retention/privacy requests.

CREATE TABLE IF NOT EXISTS intake_limits (
 key_hash TEXT PRIMARY KEY,
 attempts INTEGER NOT NULL,
 expires_at INTEGER NOT NULL
);
