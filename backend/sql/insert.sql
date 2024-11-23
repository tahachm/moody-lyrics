-- Insert Users
INSERT INTO users (cognito_sub, username, email) 
VALUES 
('sub-12345', 'john_doe', 'john.doe@example.com'),
('sub-67890', 'jane_smith', 'jane.smith@example.com');

-- Insert Songs
INSERT INTO songs (song_name, artist, album, genre)
VALUES 
('Happy', 'Pharrell Williams', 'G I R L', 'Pop'),
('Weightless', 'Marconi Union', NULL, 'Ambient');

-- Insert Moods
INSERT INTO moods (mood)
VALUES 
('happy'), 
('energetic'), 
('calm'), 
('sad');

-- Insert LLM Responses
INSERT INTO llm_responses (user_id, input_message, response_message, song_id)
VALUES 
(1, 'I feel like celebrating today!', 'Try listening to "Happy"!', 1), -- Links to "Happy"
(2, 'I need something relaxing.', 'How about "Weightless"?', 2);        -- Links to "Weightless"

-- Link Responses to Moods
INSERT INTO llm_response_moods (llm_response_id, mood_id)
VALUES 
(1, 1), -- Response 1 is linked to "happy"
(1, 2), -- Response 1 is linked to "energetic"
(2, 3), -- Response 2 is linked to "calm"
(2, 4); -- Response 2 is linked to "sad"
