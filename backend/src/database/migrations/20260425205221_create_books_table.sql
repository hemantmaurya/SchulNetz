-- 20260425205221_create_books_table.sql
-- Migration for table: books

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    author VARCHAR NOT NULL,
    isbn VARCHAR NOT NULL,
    quantity INTEGER NOT NULL,
    publisher VARCHAR NOT NULL,
    publication_year INTEGER NOT NULL,
    edition VARCHAR NOT NULL,
    category_genre VARCHAR NOT NULL,
    language VARCAHR NOT NULL,
    shelf_location VARCHAR NOT NULL,
    description TEXT NOT NULL,
    cover_image_url VARCAHR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_books_deleted_at ON books(deleted_at);

