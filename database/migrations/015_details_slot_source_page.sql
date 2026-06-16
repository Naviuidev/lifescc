ALTER TABLE `details_slot`
  ADD COLUMN `source_page` VARCHAR(64) NOT NULL DEFAULT 'book_an_appointment' AFTER `message`;

CREATE INDEX `idx_details_slot_source_page` ON `details_slot` (`source_page`);
