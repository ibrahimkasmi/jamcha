-- src/main/resources/liquibase/sql/data/comment_reports_data.sql

INSERT INTO comment_reports (comment_id, reason, details) VALUES
(1, 'Spam', 'Irrelevant message.'),
(2, 'Offensive', 'Inappropriate words used.'),
(3, 'Spam', 'Unrelated link.'),
(4, 'Offensive', 'Hate speech.'),
(5, 'Spam', 'Advertising product.'),
(6, 'Other', 'Too vague.'),
(7, 'Spam', 'Multiple links.'),
(8, 'Offensive', 'Toxic tone.');
-- Removed references to non-existent comment IDs 9 and 10