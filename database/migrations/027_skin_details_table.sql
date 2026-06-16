CREATE TABLE IF NOT EXISTS `skin_details` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(32) NOT NULL,
  `location_id` VARCHAR(64) NOT NULL,
  `message` TEXT NOT NULL,
  `service_label` VARCHAR(255) NOT NULL DEFAULT '',
  `source_page` VARCHAR(64) NOT NULL DEFAULT 'book_an_appointment',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
  `follow_up` DATE NULL DEFAULT NULL,
  `visited` ENUM('not_visited', 'visited') NOT NULL DEFAULT 'not_visited',
  `contacted` ENUM('not_contacted', 'contacted_remember') NOT NULL DEFAULT 'not_contacted',
  `customer_note` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_skin_details_created` (`created_at`),
  KEY `idx_skin_details_source_page` (`source_page`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
