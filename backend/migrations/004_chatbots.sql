-- Admin chatbot registrations (domain + business type)
CREATE TABLE IF NOT EXISTS chatbots (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  domain_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(128) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_chatbots_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
