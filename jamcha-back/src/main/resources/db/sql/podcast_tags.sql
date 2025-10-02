-- src/main/resources/sql/podcast_tags.sql

CREATE TABLE podcast_tags (
    podcast_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,

    PRIMARY KEY (podcast_id, tag_id),

    CONSTRAINT fk_podcast_tags_podcast FOREIGN KEY (podcast_id) REFERENCES podcasts(id) ON DELETE CASCADE,
    CONSTRAINT fk_podcast_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_podcast_tags_podcast ON podcast_tags(podcast_id);
CREATE INDEX idx_podcast_tags_tag ON podcast_tags(tag_id);