-- One site bot can be published to the marketing site widget at a time.
ALTER TABLE site_bots
  ADD COLUMN published TINYINT(1) NOT NULL DEFAULT 0 AFTER config_json,
  ADD KEY idx_site_bots_published (published);
