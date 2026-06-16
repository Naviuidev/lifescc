-- Franchise inquiries (public form + admin list)
USE `lifescc`;

CREATE TABLE IF NOT EXISTS `franchises` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `state` VARCHAR(64) NOT NULL,
  `district` VARCHAR(128) NOT NULL,
  `planning_option` ENUM('this_week', 'next_month', 'custom') NOT NULL,
  `planning_start` DATE NOT NULL,
  `planning_end` DATE NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
  `follow_up` DATE NULL DEFAULT NULL,
  `contacted` ENUM('not_contacted', 'contacted_remember') NOT NULL DEFAULT 'not_contacted',
  `customer_note` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_franchises_created` (`created_at`),
  KEY `idx_franchises_state` (`state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
