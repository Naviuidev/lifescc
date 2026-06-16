ALTER TABLE `blogs`
  ADD COLUMN `view_count` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `analytics_field_keys_json`;
