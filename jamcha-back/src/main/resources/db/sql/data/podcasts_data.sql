-- src/main/resources/sql/data/podcasts_data.sql
-- Sample podcast data for testing

INSERT INTO podcasts (title, slug, description, video_url, thumbnail_url, category_id, author_id, duration_minutes, view_count, published_at, is_featured, language) VALUES
('مقابلة مع خبير التكنولوجيا', 'tech-expert-interview-1', 'مقابلة شيقة مع أحد خبراء التكنولوجيا حول مستقبل الذكاء الاصطناعي', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 1, 1, 45, 1250, '2024-08-15 10:00:00', true, 'ar'),

('حديث عن ريادة الأعمال', 'entrepreneurship-talk-1', 'نقاش معمق حول تحديات وفرص ريادة الأعمال في المنطقة العربية', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 2, 2, 60, 890, '2024-08-20 14:30:00', false, 'ar'),

('مناقشة السياسة المحلية', 'local-politics-discussion-1', 'تحليل للأوضاع السياسية المحلية والتطورات الأخيرة', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 3, 1, 35, 2100, '2024-08-25 16:00:00', true, 'ar');

-- Add podcast-tag relationships
INSERT INTO podcast_tags (podcast_id, tag_id) VALUES
(1, 1), -- Tech podcast with technology tag
(1, 2), -- Tech podcast with AI tag
(2, 3), -- Entrepreneurship podcast with business tag
(2, 4), -- Entrepreneurship podcast with startup tag
(3, 5), -- Politics podcast with politics tag
(3, 6); -- Politics podcast with analysis tag