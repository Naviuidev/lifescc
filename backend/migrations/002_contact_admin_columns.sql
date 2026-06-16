-- Run once against your lifescc database (phpMyAdmin or mysql CLI).
ALTER TABLE contact
  ADD COLUMN contacted VARCHAR(32) NOT NULL DEFAULT 'not_contacted' AFTER message,
  ADD COLUMN customer_note TEXT NULL AFTER contacted,
  ADD COLUMN status VARCHAR(32) NOT NULL DEFAULT 'pending' AFTER customer_note;
