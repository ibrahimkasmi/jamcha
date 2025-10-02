-- src/main/resources/sql/topflop_entries.sql

CREATE TABLE topflop_entries (
    id BIGSERIAL PRIMARY KEY,
    person_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    reason VARCHAR(500) NOT NULL,
    position INTEGER NOT NULL,
    profile_image VARCHAR(500),
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('TOP', 'FLOP')),
    category_id BIGINT,
    author_id BIGINT NOT NULL,
    week_of DATE NOT NULL,
    vote_count INTEGER DEFAULT 0,
    language VARCHAR(10) NOT NULL DEFAULT 'ar',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_topflop_entries_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_topflop_entries_author FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_topflop_entries_week_language ON topflop_entries(week_of, language);
CREATE INDEX idx_topflop_entries_type_position ON topflop_entries(entry_type, position);
CREATE INDEX idx_topflop_entries_language ON topflop_entries(language);
CREATE INDEX idx_topflop_entries_category ON topflop_entries(category_id);
CREATE INDEX idx_topflop_entries_author ON topflop_entries(author_id);
CREATE INDEX idx_topflop_entries_vote_count ON topflop_entries(vote_count);