-- Testimonial page videos (YouTube embeds managed from admin)
CREATE TABLE IF NOT EXISTS testimonial_videos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  embed_src VARCHAR(2048) NOT NULL COMMENT 'Normalized https://www.youtube.com/embed/VIDEO_ID',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_testimonial_videos_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
