CREATE TABLE social_media_links (
    id SERIAL PRIMARY KEY,
    social_provider VARCHAR(255),
    url VARCHAR(255),
    article_id BIGINT,
    FOREIGN KEY (article_id) REFERENCES articles(id)
);