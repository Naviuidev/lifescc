-- Lead / analytics submissions tied to a published blog post
CREATE TABLE IF NOT EXISTS `blog_user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `blog_id` INT UNSIGNED NOT NULL,
  `first_name` VARCHAR(191) NULL DEFAULT NULL,
  `last_name` VARCHAR(191) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `mobile_number` VARCHAR(64) NULL DEFAULT NULL,
  `message` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_blog_user_blog_id` (`blog_id`),
  KEY `idx_blog_user_created` (`created_at`),
  CONSTRAINT `fk_blog_user_blog` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
