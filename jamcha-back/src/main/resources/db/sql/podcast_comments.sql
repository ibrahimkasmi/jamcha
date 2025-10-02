-- src/main/resources/sql/podcast_comments.sql

CREATE TABLE podcast_comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    podcast_id BIGINT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_podcast_comments_podcast FOREIGN KEY (podcast_id) REFERENCES podcasts(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_podcast_comments_podcast ON podcast_comments(podcast_id);
CREATE INDEX idx_podcast_comments_approved ON podcast_comments(is_approved);
CREATE INDEX idx_podcast_comments_created_at ON podcast_comments(created_at);