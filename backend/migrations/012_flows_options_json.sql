-- Business Query flow: store selected badge keys as JSON array.
-- Run after 011_flows_prompt_and_canvas.sql

ALTER TABLE flows
  ADD COLUMN options_json JSON NULL DEFAULT NULL AFTER prompt_text;
