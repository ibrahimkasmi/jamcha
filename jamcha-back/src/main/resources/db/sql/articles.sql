CREATE TABLE articles (
                          id SERIAL PRIMARY KEY,
                          title TEXT NOT NULL,
                          slug TEXT NOT NULL UNIQUE,
                          content TEXT NOT NULL,
                          excerpt TEXT NOT NULL,
                          featured_image TEXT,
                          video_url TEXT,
                          category_id BIGINT REFERENCES categories(id),
                          author_id BIGINT REFERENCES authors(id),
                          reading_time INTEGER NOT NULL,
                          published_at TIMESTAMP NOT NULL,
                          is_breaking BOOLEAN DEFAULT FALSE,
                          is_active BOOLEAN DEFAULT TRUE,
                          language TEXT NOT NULL DEFAULT 'ar',
                          translations JSON DEFAULT '{}',
                          social_media_links JSON DEFAULT '{}'

);

-- Indexes
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_articles_author_id ON articles(author_id);
