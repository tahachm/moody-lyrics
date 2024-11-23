CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    cognito_sub VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create the `llm_responses` table
CREATE TABLE llm_responses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),   -- who issued the LLM request 
    input_message TEXT NOT NULL,            
    response_message TEXT NOT NULL,         -- response message from LLM
    song_id INTEGER REFERENCES songs(id),   -- FK to the songs table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create the `songs` table
CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    song_name VARCHAR(150) NOT NULL,           
    artist VARCHAR(100) NOT NULL,         -- Artist name
    album VARCHAR(100),                   -- Album name (optional)
    genre VARCHAR(50),                    -- Optional: Genre
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create the `moods` table
CREATE TABLE moods (
    id SERIAL PRIMARY KEY,
    mood VARCHAR(50) NOT NULL UNIQUE,      -- mood tag (happy sad etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 5. Create the junction table `llm_response_moods` to link LLM responses with moods
CREATE TABLE llm_response_moods (
    id SERIAL PRIMARY KEY,
    llm_response_id INTEGER REFERENCES llm_responses(id) ON DELETE CASCADE,
    mood_id INTEGER REFERENCES moods(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
