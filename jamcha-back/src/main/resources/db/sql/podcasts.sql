-- src/main/resources/sql/podcasts.sql

CREATE TABLE podcasts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    category_id BIGINT,
    author_id BIGINT NOT NULL,
    duration_minutes INTEGER,
    view_count BIGINT DEFAULT 0,
    published_at TIMESTAMP NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    language VARCHAR(10) NOT NULL DEFAULT 'ar',
    translations JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_podcasts_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_podcasts_author FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_podcasts_language ON podcasts(language);
CREATE INDEX idx_podcasts_published_at ON podcasts(published_at);
CREATE INDEX idx_podcasts_featured ON podcasts(is_featured);
CREATE INDEX idx_podcasts_view_count ON podcasts(view_count);
CREATE INDEX idx_podcasts_category ON podcasts(category_id);
CREATE INDEX idx_podcasts_author ON podcasts(author_id);