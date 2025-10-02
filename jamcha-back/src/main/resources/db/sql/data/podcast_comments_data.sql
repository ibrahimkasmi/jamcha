-- src/main/resources/sql/data/podcast_comments_data.sql
-- Sample podcast comments data for testing

INSERT INTO podcast_comments (content, author_name, author_email, podcast_id, is_approved, created_at) VALUES
('مقابلة رائعة! شكرا للمعلومات القيمة حول الذكاء الاصطناعي', 'أحمد محمد', 'ahmed.mohamed@example.com', 1, true, '2024-08-15 11:30:00'),
('استفدت كثيرا من هذه المقابلة، أتطلع للمزيد', 'فاطمة أحمد', 'fatima.ahmed@example.com', 1, true, '2024-08-15 14:20:00'),
('موضوع مهم جدا، هل يمكن التوسع أكثر في الجزء الثاني؟', 'محمد علي', 'mohamed.ali@example.com', 1, true, '2024-08-16 09:15:00'),

('نصائح ممتازة لرواد الأعمال المبتدئين', 'سارة خالد', 'sara.khaled@example.com', 2, true, '2024-08-20 16:45:00'),
('تجربة ملهمة، شكرا للمشاركة', 'عمر حسن', 'omar.hassan@example.com', 2, true, '2024-08-21 10:30:00'),

('تحليل سياسي موفق ومنصف', 'ليلى إبراهيم', 'layla.ibrahim@example.com', 3, true, '2024-08-25 18:20:00'),
('أقدر الطرح الموضوعي للقضايا', 'يوسف عبدالله', 'youssef.abdullah@example.com', 3, false, '2024-08-26 12:10:00');
