-- src/main/resources/sql/data/topflop_entries_data.sql
-- Sample TopFlop data for testing

INSERT INTO topflop_entries (person_name, slug, description, reason, position, profile_image, entry_type, category_id, author_id, week_of, vote_count, language) VALUES

-- TOP entries (best performers of the week)
('أحمد الخبير التقني', 'ahmed-tech-expert-top-1', 'مطور برمجيات متميز حقق إنجازات رائعة', 'أطلق تطبيقاً مبتكراً حصل على جائزة أفضل تطبيق', 1, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'TOP', 1, 1, '2024-08-26', 45, 'ar'),

('فاطمة رائدة الأعمال', 'fatima-entrepreneur-top-2', 'رائدة أعمال ناجحة في مجال التجارة الإلكترونية', 'حققت أرباحاً قياسية في شركتها الناشئة', 2, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2', 'TOP', 2, 2, '2024-08-26', 38, 'ar'),

('محمد المحلل السياسي', 'mohamed-political-analyst-top-3', 'محلل سياسي بارز في الإعلام العربي', 'تنبؤاته السياسية كانت دقيقة بنسبة 100%', 3, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'TOP', 3, 1, '2024-08-26', 32, 'ar'),

-- FLOP entries (disappointing performers of the week)
('سعد المستثمر', 'saad-investor-flop-1', 'مستثمر فشل في قراراته الاستثمارية', 'خسر 50% من محفظته الاستثمارية في أسبوع واحد', 1, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face', 'FLOP', 2, 2, '2024-08-26', 28, 'ar'),

('نور الإعلامية', 'nour-media-personality-flop-2', 'إعلامية تورطت في فضيحة إعلامية', 'نشرت معلومات خاطئة دون التحقق من صحتها', 2, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'FLOP', 3, 1, '2024-08-26', 41, 'ar'),

('خالد الرياضي', 'khaled-sports-figure-flop-3', 'لاعب كرة قدم أداؤه مخيب للآمال', 'تسبب في خسارة فريقه نهائي البطولة', 3, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'FLOP', 1, 2, '2024-08-26', 35, 'ar');