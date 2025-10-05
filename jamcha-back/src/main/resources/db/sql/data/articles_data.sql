INSERT INTO articles (
    title, slug, content, excerpt, featured_image, video_url, category_id,
    reading_time, published_at, is_breaking, language, author_id, is_active, social_media_links, status
) VALUES

-- Technology Articles
(
    'مستقبل الذكاء الاصطناعي في العالم العربي',
    'ai-future-arabic-world',
    'يشهد العالم العربي تطوراً مذهلاً في مجال الذكاء الاصطناعي، حيث تتسارع الاستثمارات والمبادرات التقنية في المنطقة. من دولة الإمارات العربية المتحدة إلى المملكة العربية السعودية، نرى مشاريع طموحة تهدف إلى جعل المنطقة مركزاً عالمياً للابتكار التقني.

تتنوع تطبيقات الذكاء الاصطناعي في المنطقة من الخدمات الحكومية الذكية إلى القطاع الصحي والتعليمي. في الإمارات، تم إطلاق استراتيجية الإمارات للذكاء الاصطناعي 2031 التي تهدف إلى جعل الإمارات الرائدة عالمياً في هذا المجال بحلول عام 2031.

من ناحية أخرى، تواجه المنطقة تحديات عديدة منها نقص المواهب المتخصصة والحاجة إلى تطوير البنية التحتية الرقمية. كما أن هناك حاجة ماسة لتطوير نماذج ذكاء اصطناعي تفهم اللغة العربية وثقافتها بشكل أفضل.

الفرص الاستثمارية في هذا المجال هائلة، خاصة مع توجه الحكومات العربية نحو التحول الرقمي والاستثمار في التقنيات الناشئة. نتوقع أن نشهد المزيد من الشراكات الدولية والمحلية في السنوات القادمة.

في الختام، مستقبل الذكاء الاصطناعي في العالم العربي مشرق، ولكنه يتطلب جهوداً مشتركة من الحكومات والقطاع الخاص والأكاديميين لتحقيق الإمكانات الكاملة لهذه التقنية الثورية.',
    'استكشاف مستقبل الذكاء الاصطناعي في المنطقة العربية والفرص والتحديات المرتبطة بهذا التطور التقني المتسارع.',
    '/Users/ibrahimkasmi/Documents/jamcha-project/jamcha-client/src/assets/images/ai-future-arabic.jpg',
    NULL,
    2,
    12,
    NOW() - INTERVAL '2 days',
    FALSE,
    'ar',
    (SELECT id FROM authors WHERE provider_id = 'fatima_tech'),
    TRUE,
    '[{"socialProvider": "FACEBOOK", "url": "https://www.facebook.com/article1"}, {"socialProvider": "X", "url": "https://www.x.com/article1"}]',
    'Accepted'
),

-- Health Article
(
    'أسرار الصحة النفسية في العصر الرقمي',
    'mental-health-digital-age',
    'في عصر تهيمن عليه التكنولوجيا ووسائل التواصل الاجتماعي، أصبحت الصحة النفسية موضوعاً أكثر أهمية من أي وقت مضى. ...',
    'دليل شامل للحفاظ على الصحة النفسية في عصر التكنولوجيا، مع نصائح عملية للتعامل مع ضغوط الحياة الرقمية.',
    '/Users/ibrahimkasmi/Documents/jamcha-project/jamcha-client/src/assets/images/mental-health-digital.jpg',
    NULL,
    3,
    8,
    NOW() - INTERVAL '1 day',
    FALSE,
    'ar',
    (SELECT id FROM authors WHERE provider_id = 'mohammed_journalist'),
    TRUE,
    '[{"socialProvider": "INSTAGRAM", "url": "https://www.instagram.com/article2"}]',
    'Accepted'
),

-- Finance Article
(
    'استراتيجيات الاستثمار الذكي للمبتدئين',
    'smart-investment-beginners',
    'الاستثمار هو أحد أهم الطرق لبناء الثروة على المدى الطويل ...',
    'دليل شامل للمبتدئين في عالم الاستثمار، يغطي الأساسيات والاستراتيجيات الذكية لبناء محفظة استثمارية ناجحة.',
    '/Users/ibrahimkasmi/Documents/jamcha-project/jamcha-client/src/assets/images/smart-investment-guide.jpg',
    NULL,
    4,
    10,
    NOW() - INTERVAL '3 days',
    FALSE,
    'ar',
    (SELECT id FROM authors WHERE provider_id = 'sara_finance'),
    TRUE,
    '[]',
    'Accepted'
),

-- Travel Article
(
    'وجهات سياحية عربية مخفية تستحق الاكتشاف',
    'hidden-arabic-destinations',
    'العالم العربي مليء بالكنوز المخفية ...',
    'اكتشف أجمل الوجهات السياحية المخفية في العالم العربي ...',
    '/Users/ibrahimkasmi/Documents/jamcha-project/jamcha-client/src/assets/images/hidden-arabic-destinations.jpg',
    NULL,
    6,
    15,
    NOW() - INTERVAL '5 days',
    FALSE,
    'ar',
    (SELECT id FROM authors WHERE provider_id = 'khalid_travel'),
    TRUE,
    '[]',
    'Accepted'
),

-- Food Article
(
    'فن الطبخ العربي: وصفات تقليدية بلمسة عصرية',
    'arabic-cooking-modern-twist',
    'المطبخ العربي غني بالنكهات والتقاليد ...',
    'تعلم كيفية إعطاء لمسة عصرية للأطباق العربية التقليدية ...',
    '/Users/ibrahimkasmi/Documents/jamcha-project/jamcha-client/src/assets/images/arabic-cooking-modern.jpg',
    NULL,
    5,
    11,
    NOW() - INTERVAL '4 days',
    FALSE,
    'ar',
    (SELECT id FROM authors WHERE provider_id = 'noor_cooking'),
    TRUE,
    '[]',
    'Accepted'
),

-- Education Article
(
    'التعلم الرقمي: ثورة في التعليم العربي',
    'digital-learning-arabic-education',
    'شهد التعليم في العالم العربي تحولاً جذرياً ...',
    'استكشاف ثورة التعلم الرقمي في العالم العربي ...',
    '/Users/ibrahimkasmi/Documents/jamcha-project/jamcha-client/src/assets/images/digital-learning-arabic.jpg',
    NULL,
    7,
    13,
    NOW() - INTERVAL '6 days',
    FALSE,
    'ar',
    (SELECT id FROM authors WHERE provider_id = 'leila_education'),
    TRUE,
    '[]',
    'Accepted'
),

-- Sports Article
(
    'رياضة كرة القدم العربية: إنجازات وطموحات',
    'arabic-football-achievements',
    'شهدت كرة القدم العربية في السنوات الأخيرة تطوراً ملحوظاً ...',
    'نظرة شاملة على إنجازات كرة القدم العربية الحديثة ...',
    '/Users/ibrahimkasmi/Documents/jamcha-project/jamcha-client/src/assets/images/arabic-football-achievements.jpg',
    NULL,
    8,
    9,
    NOW() - INTERVAL '7 days',
    FALSE,
    'ar',
    (SELECT id FROM authors WHERE provider_id = 'ali_sports'),
    TRUE,
    '[]',
    'Accepted'
),

-- Arts Article
(
    'النهضة الفنية الرقمية في العالم العربي',
    'digital-art-renaissance-arab',
    'يشهد العالم العربي نهضة فنية رقمية حقيقية ...',
    'استكشاف النهضة الفنية الرقمية في العالم العربي ...',
    '/Users/ibrahimkasmi/Documents/jamcha-project/jamcha-client/src/assets/images/digital-art-renaissance.jpg',
    NULL,
    9,
    14,
    NOW() - INTERVAL '8 days',
    FALSE,
    'ar',
    (SELECT id FROM authors WHERE provider_id = 'zeinab_arts'),
    TRUE,
    '[]',
    'Accepted'
),

-- Breaking News
(
    'عاجل: إطلاق أكبر مشروع للطاقة المتجددة في المنطقة',
    'breaking-renewable-energy-project',
    'في خطوة تاريخية نحو مستقبل أكثر استدامة ...',
    'عاجل: إعلان أكبر مشروع للطاقة المتجددة ...',
    '/Users/ibrahimkasmi/Documents/jamcha-project/jamcha-client/src/assets/images/breaking-renewable-energy.jpg',
    NULL,
    1,
    6,
    NOW() - INTERVAL '30 minutes',
    TRUE,
    'ar',
    (SELECT id FROM authors WHERE provider_id = 'ahmed_writer'),
    TRUE,
    '[]',
    'Accepted'
),

-- Business Article
(
    'ريادة الأعمال في عصر الاقتصاد الرقمي',
    'entrepreneurship-digital-economy',
    'شهدت ريادة الأعمال في العالم العربي تحولاً جذرياً ...',
    'استكشاف مشهد ريادة الأعمال المتنامي ...',
    '/Users/ibrahimkasmi/Documents/jamcha-project/jamcha-client/src/assets/images/entrepreneurship-digital.jpg',
    NULL,
    4,
    12,
    NOW() - INTERVAL '1 week',
    FALSE,
    'ar',
    (SELECT id FROM authors WHERE provider_id = 'sara_finance'),
    TRUE,
    '[]',
    'Accepted'
);
