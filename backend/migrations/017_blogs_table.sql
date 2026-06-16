USE `lifescc`;

CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(500) NOT NULL,
  `banner_headline` VARCHAR(500) NULL DEFAULT NULL,
  `banner_subtitle` TEXT NULL DEFAULT NULL,
  `banner_button_label` VARCHAR(255) NULL DEFAULT NULL,
  `banner_button_link` VARCHAR(2048) NULL DEFAULT NULL,
  `cover_image` VARCHAR(512) NULL DEFAULT NULL,
  `listing_summary` TEXT NULL DEFAULT NULL,
  `blocks_json` LONGTEXT NOT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'published',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_blogs_slug` (`slug`),
  KEY `idx_blogs_created` (`created_at`),
  KEY `idx_blogs_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
