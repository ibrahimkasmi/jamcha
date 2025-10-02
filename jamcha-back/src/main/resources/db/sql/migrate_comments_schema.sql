-- Add new user columns to existing table
ALTER TABLE comments
ADD COLUMN user_email VARCHAR(255),
ADD COLUMN user_username VARCHAR(255),
ADD COLUMN user_password_hash VARCHAR(255);

-- Migrate existing data from authors table to new user fields
UPDATE comments
SET
    user_email = COALESCE(authors.email, 'migrated@example.com'),
    user_username = COALESCE(authors.name, 'Migrated User'),
    user_password_hash = '$2a$10$defaultHashForMigration'
FROM authors
WHERE comments.author_id = authors.id;

-- Handle any comments without authors (set defaults)
UPDATE comments
SET
    user_email = 'unknown@example.com',
    user_username = 'Unknown User',
    user_password_hash = '$2a$10$defaultHashForMigration'
WHERE user_email IS NULL;

-- Make new columns NOT NULL
ALTER TABLE comments
ALTER COLUMN user_email SET NOT NULL,
ALTER COLUMN user_username SET NOT NULL,
ALTER COLUMN user_password_hash SET NOT NULL;

-- Update default for is_approved to TRUE
ALTER TABLE comments ALTER COLUMN is_approved SET DEFAULT TRUE;

-- Drop the old author_id column
ALTER TABLE comments DROP COLUMN author_id;

-- Add new indexes
CREATE INDEX idx_comments_user_email ON comments(user_email);