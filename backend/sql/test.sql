-- Most suggested song by LLM
SELECT 
    s.song_name, 
    s.artist, 
    COUNT(lr.id) AS suggestion_count
FROM 
    songs s
JOIN 
    llm_responses lr ON s.id = lr.song_id
GROUP BY 
    s.song_name, s.artist
ORDER BY 
    suggestion_count DESC;

-- Most common moods returned by LLM
SELECT 
    m.mood, 
    COUNT(lrm.id) AS mood_count
FROM 
    moods m
JOIN 
    llm_response_moods lrm ON m.id = lrm.mood_id
GROUP BY 
    m.mood
ORDER BY 
    mood_count DESC;

-- Songs associated with a specific mood
SELECT 
    s.song_name, 
    s.artist, 
    s.album, 
    m.mood
FROM 
    songs s
JOIN 
    llm_responses lr ON s.id = lr.song_id
JOIN 
    llm_response_moods lrm ON lr.id = lrm.llm_response_id
JOIN 
    moods m ON lrm.mood_id = m.id
WHERE 
    m.mood = 'happy';

-- Users and their suggested songs
SELECT 
    u.username, 
    u.email, 
    s.song_name, 
    s.artist, 
    lr.input_message, 
    lr.response_message
FROM 
    users u
JOIN 
    llm_responses lr ON u.id = lr.user_id
JOIN 
    songs s ON lr.song_id = s.id
ORDER BY 
    u.username;


-- Most popular moods by user
SELECT 
    u.username, 
    m.mood, 
    COUNT(lrm.id) AS mood_count
FROM 
    users u
JOIN 
    llm_responses lr ON u.id = lr.user_id
JOIN 
    llm_response_moods lrm ON lr.id = lrm.llm_response_id
JOIN 
    moods m ON lrm.mood_id = m.id
GROUP BY 
    u.username, m.mood
ORDER BY 
    u.username, mood_count DESC;


-- Moods associated with a specific song
SELECT 
    s.song_name, 
    m.mood
FROM 
    songs s
JOIN 
    llm_responses lr ON s.id = lr.song_id
JOIN 
    llm_response_moods lrm ON lr.id = lrm.llm_response_id
JOIN 
    moods m ON lrm.mood_id = m.id
WHERE 
    s.song_name = 'Happy';
