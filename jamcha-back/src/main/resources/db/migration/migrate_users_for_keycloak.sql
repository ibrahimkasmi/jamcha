-- Migration script to update Users table for Keycloak integration
-- This script adds new columns and updates existing data

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS keycloak_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update existing users to set default values
UPDATE users 
SET 
    created_at = CURRENT_TIMESTAMP,
    is_active = TRUE
WHERE created_at IS NULL OR is_active IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_keycloak_id ON users(keycloak_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Update role column to use proper enum values
-- This handles migration from string roles to enum roles

UPDATE users SET role = 'AUTHOR' WHERE role = 'author' OR role = 'AUTHOR';
UPDATE users SET role = 'ADMIN' WHERE role = 'admin' OR role = 'ADMIN';

-- Add constraint to ensure role is not null
ALTER TABLE users ALTER COLUMN role SET NOT NULL;

-- Add constraint to ensure role has valid values
ALTER TABLE users ADD CONSTRAINT check_role_valid 
CHECK (role IN ( 'AUTHOR', 'ADMIN'));

-- Ensure email is unique
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

COMMIT;
