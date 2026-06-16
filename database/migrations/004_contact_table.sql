-- Contact form submissions (Contact Us page)
USE `lifescc`;

CREATE TABLE IF NOT EXISTS `contact` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(120) NOT NULL,
  `last_name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `country_code` VARCHAR(8) NOT NULL DEFAULT '+91',
  `phone` VARCHAR(64) NOT NULL,
  `service` VARCHAR(255) NOT NULL,
  `submit_method` VARCHAR(32) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contact_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
