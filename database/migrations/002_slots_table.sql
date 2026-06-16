-- Run manually if your database was created before the slots table existed:
USE `lifescc`;

CREATE TABLE IF NOT EXISTS `slots` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(32) NOT NULL,
  `service` VARCHAR(255) NOT NULL,
  `slot_datetime` DATETIME NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_slots_slot_datetime` (`slot_datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
