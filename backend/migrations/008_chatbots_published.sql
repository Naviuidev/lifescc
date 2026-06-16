-- Site visibility: only one chatbot should be published to the marketing site at a time.
-- Run after 007_chatbot_flow_types_and_conversations.sql

ALTER TABLE chatbots
  ADD COLUMN published TINYINT(1) NOT NULL DEFAULT 0 AFTER business_title,
  ADD KEY idx_chatbots_published (published);
