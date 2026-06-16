-- Add website URL for chatbot template listing / creation.
ALTER TABLE chatbots
  ADD COLUMN website_url VARCHAR(2048) NULL DEFAULT NULL AFTER business_title;
