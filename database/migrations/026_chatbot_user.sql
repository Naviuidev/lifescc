-- Site widget: capture visitors who stay 30s+ on branch-finder step (partial answers + email).
CREATE TABLE IF NOT EXISTS `chatbot_user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `chatbot_id` INT UNSIGNED NOT NULL,
  `dwell_seconds` INT UNSIGNED NOT NULL DEFAULT 30,
  `summary_line` VARCHAR(512) NOT NULL DEFAULT '',
  `payload_json` MEDIUMTEXT NOT NULL,
  `email_sent` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_chatbot_user_bot_created` (`chatbot_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
