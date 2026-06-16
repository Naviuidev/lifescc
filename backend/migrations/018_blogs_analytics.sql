-- Blog analytics form integration (stored per post for future public/embed use)
ALTER TABLE `blogs`
  ADD COLUMN `analytics_enabled` TINYINT(1) NOT NULL DEFAULT 0 AFTER `status`,
  ADD COLUMN `analytics_subject` VARCHAR(500) NULL DEFAULT NULL AFTER `analytics_enabled`,
  ADD COLUMN `analytics_first_name` VARCHAR(191) NULL DEFAULT NULL AFTER `analytics_subject`,
  ADD COLUMN `analytics_last_name` VARCHAR(191) NULL DEFAULT NULL AFTER `analytics_first_name`,
  ADD COLUMN `analytics_email` VARCHAR(255) NULL DEFAULT NULL AFTER `analytics_last_name`,
  ADD COLUMN `analytics_mobile` VARCHAR(64) NULL DEFAULT NULL AFTER `analytics_email`,
  ADD COLUMN `analytics_message` TEXT NULL DEFAULT NULL AFTER `analytics_mobile`,
  ADD COLUMN `analytics_badges_json` VARCHAR(1024) NULL DEFAULT NULL AFTER `analytics_message`;
