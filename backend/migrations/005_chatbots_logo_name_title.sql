-- Run this AFTER 004_chatbots.sql (adds logo + name, renames business_type → business_title, drops domain_name)
-- If you already have data, name is copied from domain_name before drop.

ALTER TABLE chatbots
  ADD COLUMN logo VARCHAR(2048) NULL DEFAULT NULL AFTER id;

ALTER TABLE chatbots
  ADD COLUMN name VARCHAR(255) NULL DEFAULT NULL AFTER logo;

UPDATE chatbots SET name = domain_name WHERE name IS NULL OR TRIM(name) = '';

ALTER TABLE chatbots
  MODIFY COLUMN name VARCHAR(255) NOT NULL;

ALTER TABLE chatbots
  CHANGE COLUMN business_type business_title VARCHAR(128) NOT NULL;

ALTER TABLE chatbots
  DROP COLUMN domain_name;
