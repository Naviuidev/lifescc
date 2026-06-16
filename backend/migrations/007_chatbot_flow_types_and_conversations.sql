-- Flow kinds (greeting, collect fields, query menu, branches) + saved conversations.
-- Run after 006_chatbot_flows.sql

ALTER TABLE chatbot_flows
  ADD COLUMN flow_type VARCHAR(64) NOT NULL DEFAULT 'custom' AFTER placeholder_text;

CREATE TABLE IF NOT EXISTS chatbot_flow_options (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  flow_id INT UNSIGNED NOT NULL,
  option_key VARCHAR(64) NOT NULL,
  label VARCHAR(512) NOT NULL,
  target_flow_id INT UNSIGNED NULL DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_chatbot_flow_option (flow_id, option_key),
  KEY idx_cfo_flow (flow_id),
  KEY idx_cfo_target (target_flow_id),
  CONSTRAINT fk_cfo_flow
    FOREIGN KEY (flow_id) REFERENCES chatbot_flows (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_cfo_target_flow
    FOREIGN KEY (target_flow_id) REFERENCES chatbot_flows (id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  chatbot_id INT UNSIGNED NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'open',
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at DATETIME NULL DEFAULT NULL,
  client_ip VARCHAR(45) NULL DEFAULT NULL,
  user_agent VARCHAR(512) NULL DEFAULT NULL,
  meta JSON NULL,
  PRIMARY KEY (id),
  KEY idx_cc_bot_started (chatbot_id, started_at),
  KEY idx_cc_status (status),
  CONSTRAINT fk_cc_chatbot
    FOREIGN KEY (chatbot_id) REFERENCES chatbots (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chatbot_conversation_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id BIGINT UNSIGNED NOT NULL,
  role VARCHAR(16) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  flow_id INT UNSIGNED NULL DEFAULT NULL,
  option_key VARCHAR(64) NULL DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ccm_conv (conversation_id, sort_order, id),
  CONSTRAINT fk_ccm_conversation
    FOREIGN KEY (conversation_id) REFERENCES chatbot_conversations (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_ccm_flow
    FOREIGN KEY (flow_id) REFERENCES chatbot_flows (id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
