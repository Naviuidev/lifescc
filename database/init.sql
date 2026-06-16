-- Create database lifescc (MySQL / MariaDB)
CREATE DATABASE IF NOT EXISTS `lifescc`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `lifescc`;

CREATE TABLE IF NOT EXISTS `slots` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(32) NOT NULL,
  `service` VARCHAR(255) NOT NULL,
  `slot_datetime` DATETIME NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
  `follow_up` DATE NULL DEFAULT NULL,
  `visited` ENUM('not_visited', 'visited') NOT NULL DEFAULT 'not_visited',
  `contacted` ENUM('not_contacted', 'contacted_remember') NOT NULL DEFAULT 'not_contacted',
  `customer_note` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_slots_slot_datetime` (`slot_datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `details_slot` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(32) NOT NULL,
  `location_id` VARCHAR(64) NOT NULL,
  `treatment` VARCHAR(32) NOT NULL,
  `message` TEXT NOT NULL,
  `source_page` VARCHAR(64) NOT NULL DEFAULT 'book_an_appointment',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
  `follow_up` DATE NULL DEFAULT NULL,
  `visited` ENUM('not_visited', 'visited') NOT NULL DEFAULT 'not_visited',
  `contacted` ENUM('not_contacted', 'contacted_remember') NOT NULL DEFAULT 'not_contacted',
  `customer_note` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_details_slot_created` (`created_at`),
  KEY `idx_details_slot_source_page` (`source_page`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `weight_loss` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(32) NOT NULL,
  `location_id` VARCHAR(64) NOT NULL,
  `message` TEXT NOT NULL,
  `source_page` VARCHAR(64) NOT NULL DEFAULT 'book_an_appointment',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
  `follow_up` DATE NULL DEFAULT NULL,
  `visited` ENUM('not_visited', 'visited') NOT NULL DEFAULT 'not_visited',
  `contacted` ENUM('not_contacted', 'contacted_remember') NOT NULL DEFAULT 'not_contacted',
  `customer_note` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_weight_loss_created` (`created_at`),
  KEY `idx_weight_loss_source_page` (`source_page`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `skin_data` (
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
  KEY `idx_skin_data_created` (`created_at`),
  KEY `idx_skin_data_source_page` (`source_page`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `analytics_enabled` TINYINT(1) NOT NULL DEFAULT 0,
  `analytics_subject` VARCHAR(500) NULL DEFAULT NULL,
  `analytics_first_name` VARCHAR(191) NULL DEFAULT NULL,
  `analytics_last_name` VARCHAR(191) NULL DEFAULT NULL,
  `analytics_email` VARCHAR(255) NULL DEFAULT NULL,
  `analytics_mobile` VARCHAR(64) NULL DEFAULT NULL,
  `analytics_message` TEXT NULL DEFAULT NULL,
  `analytics_badges_json` VARCHAR(1024) NULL DEFAULT NULL,
  `analytics_field_keys_json` VARCHAR(512) NULL DEFAULT NULL,
  `view_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_blogs_slug` (`slug`),
  KEY `idx_blogs_created` (`created_at`),
  KEY `idx_blogs_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `blog_user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `blog_id` INT UNSIGNED NOT NULL,
  `first_name` VARCHAR(191) NULL DEFAULT NULL,
  `last_name` VARCHAR(191) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `mobile_number` VARCHAR(64) NULL DEFAULT NULL,
  `message` TEXT NULL DEFAULT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
  `contacted` ENUM('not_contacted', 'contacted_remember') NOT NULL DEFAULT 'not_contacted',
  `customer_note` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_blog_user_blog_id` (`blog_id`),
  KEY `idx_blog_user_created` (`created_at`),
  CONSTRAINT `fk_blog_user_blog` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `custom_chatbots` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `published` TINYINT(1) NOT NULL DEFAULT 0,
  `steps_json` JSON NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_custom_chatbots_created` (`created_at`),
  KEY `idx_custom_chatbots_published` (`published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chatbot_user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `chatbot_id` INT UNSIGNED NOT NULL,
  `dwell_seconds` INT UNSIGNED NOT NULL DEFAULT 30,
  `summary_line` VARCHAR(512) NOT NULL DEFAULT '',
  `payload_json` MEDIUMTEXT NOT NULL,
  `email_sent` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_chatbot_user_bot_created` (`chatbot_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
