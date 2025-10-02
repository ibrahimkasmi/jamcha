-- src/main/resources/sql/data/podcast_tags_data.sql
-- Sample podcast tags data for testing

INSERT INTO podcast_tags (podcast_id, tag_id) VALUES
-- Tech podcast with technology-related tags
(1, 1), -- Technology tag
(1, 2), -- AI tag  
(1, 15), -- Innovation tag (if exists)

-- Entrepreneurship podcast with business-related tags  
(2, 3), -- Business tag
(2, 4), -- Startup tag
(2, 16), -- Leadership tag (if exists)

-- Politics podcast with politics-related tags
(3, 5), -- Politics tag
(3, 6), -- Analysis tag
(3, 17); -- Current Affairs tag (if exists)
