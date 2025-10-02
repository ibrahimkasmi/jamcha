CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Prevent duplicate bookmarks
ALTER TABLE bookmarks ADD CONSTRAINT uk_user_article UNIQUE (user_id, article_id);