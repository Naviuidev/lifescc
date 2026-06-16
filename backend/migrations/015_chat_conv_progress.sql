-- Optional: track last update for in-progress preview conversations.
ALTER TABLE chat_conv
  ADD COLUMN updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Allow in_progress status (already VARCHAR(32)); no schema change required for status values.
