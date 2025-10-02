-- src/main/resources/liquibase/sql/data/comments_data.sql

INSERT INTO comments (
    article_id, content, user_email, user_username,
    is_approved, likes_count, is_reported
) VALUES
(2, 'مقال رائع! شكراً لك على المشاركة المفيدة.', 'alice@example.com', 'أليس', TRUE, 5, FALSE),
(2, 'معلومات قيمة جداً، استفدت كثيراً من القراءة.', 'bob@example.com', 'بوب', TRUE, 3, FALSE),
(2, 'هل يمكنك توضيح النقطة الثالثة أكثر؟', 'sara@example.com', 'سارة', TRUE, 1, FALSE),
(3, 'محتوى مفيد ومفصل، أحسنت!', 'charlie@example.com', 'تشارلي', TRUE, 4, FALSE),
(3, 'أتفق معك تماماً في هذه النقاط.', 'diana@example.com', 'ديانا', TRUE, 2, FALSE),
(4, 'مقال ممتاز، في انتظار المزيد من المحتوى.', 'eve@example.com', 'إيف', TRUE, 6, FALSE),
(2, 'شكراً أليس، سأحاول توضيح ذلك في مقال منفصل.', 'admin@jamcha.ma', 'فريق جمشة', TRUE, 0, FALSE),
(3, 'موضوع شيق، هل لديك مصادر إضافية؟', 'frank@example.com', 'فرانك', TRUE, 1, FALSE);

-- Replies will be added later via the API