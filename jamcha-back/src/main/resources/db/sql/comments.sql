-- src/main/resources/sql/comments.sql

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    -- Simple user fields - no authentication needed
    user_email VARCHAR(255) NOT NULL,
    user_username VARCHAR(255) NOT NULL,
    -- Parent comment for replies
    parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    -- Flags
    is_approved BOOLEAN DEFAULT TRUE,
    likes_count INTEGER DEFAULT 0,
    is_reported BOOLEAN DEFAULT FALSE,
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_comments_user_email ON comments(user_email);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);