-- Tags for first article
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'first-article' AND t.name = 'intro';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'first-article' AND t.name = 'welcome';

-- Tags for second article
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'second-article' AND t.name = 'tech';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'second-article' AND t.name = 'update';

-- Tags for third article
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'third-article' AND t.name = 'wellness';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'third-article' AND t.name = 'tips';

-- Tags for fourth article
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'fourth-article' AND t.name = 'money';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'fourth-article' AND t.name = 'budget';

-- Tags for fifth article
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'fifth-article' AND t.name = 'food';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'fifth-article' AND t.name = 'kitchen';

-- Tags for sixth article
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'sixth-article' AND t.name = 'places';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'sixth-article' AND t.name = 'journey';

-- Tags for seventh article
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'seventh-article' AND t.name = 'school';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'seventh-article' AND t.name = 'learning';

-- Tags for eighth article
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'eighth-article' AND t.name = 'ai';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'eighth-article' AND t.name = 'future';

-- Tags for ninth article
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'ninth-article' AND t.name = 'games';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'ninth-article' AND t.name = 'fun';

-- Tags for tenth article
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'tenth-article' AND t.name = 'music';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'tenth-article' AND t.name = 'vibes';
