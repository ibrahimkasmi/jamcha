-- src/main/resources/sql/authors.sql

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    avatar TEXT,
    provider TEXT,
    provider_id TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX idx_authors_provider_id ON authors(provider_id);