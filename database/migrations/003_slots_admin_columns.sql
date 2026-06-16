-- Run in phpMyAdmin or MySQL CLI after backup.
USE `lifescc`;

ALTER TABLE `slots`
  ADD COLUMN `status` VARCHAR(32) NOT NULL DEFAULT 'pending' AFTER `created_at`,
  ADD COLUMN `follow_up` DATE NULL DEFAULT NULL AFTER `status`,
  ADD COLUMN `visited` ENUM('not_visited', 'visited') NOT NULL DEFAULT 'not_visited' AFTER `follow_up`,
  ADD COLUMN `contacted` ENUM('not_contacted', 'contacted_remember') NOT NULL DEFAULT 'not_contacted' AFTER `visited`,
  ADD COLUMN `customer_note` TEXT NULL DEFAULT NULL AFTER `contacted`;
