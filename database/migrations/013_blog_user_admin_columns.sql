-- CRM-style follow-up on blog form submissions (aligns with slots/contact patterns)
ALTER TABLE `blog_user`
  ADD COLUMN `status` VARCHAR(32) NOT NULL DEFAULT 'pending' AFTER `message`,
  ADD COLUMN `contacted` ENUM('not_contacted', 'contacted_remember') NOT NULL DEFAULT 'not_contacted' AFTER `status`,
  ADD COLUMN `customer_note` TEXT NULL DEFAULT NULL AFTER `contacted`;
