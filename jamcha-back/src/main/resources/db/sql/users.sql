CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role TEXT,
    provider TEXT,
    provider_id TEXT
);

-- Index
CREATE INDEX idx_users_username ON users(username);
