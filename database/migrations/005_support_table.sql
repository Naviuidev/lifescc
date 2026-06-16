-- Customer support requests (Contact Us — Customer Support flow)
USE `lifescc`;

CREATE TABLE IF NOT EXISTS `support` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(200) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(64) NOT NULL,
  `branch_id` VARCHAR(64) NOT NULL COMMENT 'Matches LIFESCC_BRANCHES id',
  `query` TEXT NOT NULL,
  `contacted` VARCHAR(32) NOT NULL DEFAULT 'not_contacted',
  `customer_note` TEXT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_support_created_at` (`created_at`),
  KEY `idx_support_branch_id` (`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
