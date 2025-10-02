
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
-- Step 2: Create user records for authors that don't have matching users (IDs 4-10)
-- We'll create basic user records for these authors
INSERT INTO users (id, username, password, email, role, provider, provider_id, keycloak_id, created_at, updated_at, is_active)
SELECT
    a.id,
    LOWER(REPLACE(a.name, ' ', '_')) as username,  -- Generate username from author name
    'temp_password_' || a.id as password,  -- Temporary password
    a.email,
    'AUTHOR' as role,
    a.provider,
    a.provider_id,
    NULL as keycloak_id,
    a.created_at,
    NULL as updated_at,
    true as is_active
FROM authors a
WHERE a.id NOT IN (SELECT id FROM users);

-- Step 3: Update the users sequence to continue from the highest ID
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Step 4: Remove duplicate columns from authors table
ALTER TABLE authors
    DROP COLUMN email,
    DROP COLUMN provider,
    DROP COLUMN provider_id,
    DROP COLUMN created_at;

-- Step 5: Rename 'name' to 'author_name' to avoid confusion
ALTER TABLE authors
    RENAME COLUMN name TO author_name;

-- Step 6: Add foreign key constraint for inheritance
ALTER TABLE authors
    ADD CONSTRAINT fk_authors_users
        FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE;

-- Step 7: Verify the migration
-- Uncomment these lines to check the results:
-- SELECT 'users_after' as table_name, COUNT(*) as count FROM users;
-- SELECT 'authors_after' as table_name, COUNT(*) as count FROM authors;
-- SELECT 'inheritance_check' as check_type, COUNT(*) as count FROM users u INNER JOIN authors a ON u.id = a.id;