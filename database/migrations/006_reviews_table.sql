-- Customer reviews (pending until admin approves; approved show on site)
USE `lifescc`;

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_name` VARCHAR(200) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `treatment` VARCHAR(255) NOT NULL,
  `review_text` TEXT NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL,
  `profile_image` VARCHAR(512) NULL DEFAULT NULL COMMENT 'Relative path under public, e.g. uploads/reviews/xxx.jpg',
  `status` ENUM('pending', 'approved', 'discarded') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_status` (`status`),
  KEY `idx_reviews_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
