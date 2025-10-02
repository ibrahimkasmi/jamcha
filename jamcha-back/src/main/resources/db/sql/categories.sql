CREATE TABLE categories (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(50) NOT NULL UNIQUE,
                            slug VARCHAR(50) NOT NULL UNIQUE,
                            color VARCHAR(20),
                            icon VARCHAR(20),
                            translations VARCHAR(500) DEFAULT ''
);