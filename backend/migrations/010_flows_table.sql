-- Dedicated flows table for template-bound flow setup (starting with Greeting + Name).
CREATE TABLE IF NOT EXISTS flows (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  chatbot_id INT UNSIGNED NOT NULL,
  flow_key VARCHAR(64) NOT NULL DEFAULT 'greeting_name',
  greeting_text VARCHAR(512) NOT NULL,
  name_placeholder VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_flows_template_key (chatbot_id, flow_key),
  KEY idx_flows_updated (updated_at),
  CONSTRAINT fk_flows_chatbot
    FOREIGN KEY (chatbot_id) REFERENCES chatbots (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
