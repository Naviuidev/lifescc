-- Which form fields the public analytics/lead form should show (selected via badges in admin)
ALTER TABLE `blogs`
  ADD COLUMN `analytics_field_keys_json` VARCHAR(512) NULL DEFAULT NULL AFTER `analytics_badges_json`;
