-- Conversation flows per chatbot (nodes) and directed edges (transformations / order).
-- Run after 005_chatbots_logo_name_title.sql

CREATE TABLE IF NOT EXISTS chatbot_flows (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  chatbot_id INT UNSIGNED NOT NULL,
  heading VARCHAR(512) NOT NULL DEFAULT '',
  placeholder_text VARCHAR(1024) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_chatbot_flows_bot_order (chatbot_id, sort_order, id),
  CONSTRAINT fk_chatbot_flows_chatbot
    FOREIGN KEY (chatbot_id) REFERENCES chatbots (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chatbot_flow_edges (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  chatbot_id INT UNSIGNED NOT NULL,
  from_flow_id INT UNSIGNED NOT NULL,
  to_flow_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_chatbot_flow_edge (chatbot_id, from_flow_id, to_flow_id),
  KEY idx_cfe_chatbot (chatbot_id),
  KEY idx_cfe_from (from_flow_id),
  KEY idx_cfe_to (to_flow_id),
  CONSTRAINT fk_cfe_chatbot
    FOREIGN KEY (chatbot_id) REFERENCES chatbots (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_cfe_from_flow
    FOREIGN KEY (from_flow_id) REFERENCES chatbot_flows (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_cfe_to_flow
    FOREIGN KEY (to_flow_id) REFERENCES chatbot_flows (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
