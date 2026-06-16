-- Extend flows for email/mobile (prompt only) and store builder canvas per template.
-- Run after 010_flows_table.sql

ALTER TABLE flows
  MODIFY greeting_text VARCHAR(512) NULL DEFAULT NULL,
  MODIFY name_placeholder VARCHAR(255) NULL DEFAULT NULL;

ALTER TABLE flows
  ADD COLUMN prompt_text VARCHAR(512) NULL DEFAULT NULL AFTER name_placeholder;

CREATE TABLE IF NOT EXISTS chatbot_flow_canvas (
  chatbot_id INT UNSIGNED NOT NULL,
  canvas_json JSON NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (chatbot_id),
  CONSTRAINT fk_chatbot_flow_canvas_chatbot
    FOREIGN KEY (chatbot_id) REFERENCES chatbots (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
