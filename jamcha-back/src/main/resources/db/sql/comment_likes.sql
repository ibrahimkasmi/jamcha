CREATE TABLE comment_likes (
    id SERIAL PRIMARY KEY,
    comment_id BIGINT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    liked BOOLEAN DEFAULT TRUE
);

-- Prevent duplicate likes
ALTER TABLE comment_likes ADD CONSTRAINT uk_comment_user UNIQUE (comment_id, user_id);