-- Preview / admin flow conversations (JSON transcript). Run after chatbots exists.

CREATE TABLE IF NOT EXISTS chat_conv (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  chatbot_id INT UNSIGNED NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'completed',
  messages_json JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_chat_conv_bot_created (chatbot_id, created_at DESC),
  CONSTRAINT fk_chat_conv_chatbot
    FOREIGN KEY (chatbot_id) REFERENCES chatbots (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
