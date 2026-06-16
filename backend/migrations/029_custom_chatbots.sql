-- Replace legacy site_bots with admin-defined flow steps (JSON).
DROP TABLE IF EXISTS site_bots;

CREATE TABLE IF NOT EXISTS custom_chatbots (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  published TINYINT(1) NOT NULL DEFAULT 0,
  steps_json JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_custom_chatbots_created (created_at),
  KEY idx_custom_chatbots_published (published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
