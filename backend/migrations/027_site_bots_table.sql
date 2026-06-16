-- Site bot wizard registrations (quick actions + per-step config JSON).
-- Run on MySQL 5.7+ / MariaDB 10.2+ with JSON support.

CREATE TABLE IF NOT EXISTS site_bots (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  selected_actions_json JSON NOT NULL,
  config_json JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_site_bots_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
