import pkg from 'pg';
const { Pool } = pkg; // Destructure Pool from the default export
import DB_CONFIG from './config.js'; // Import your database config

// Create a connection pool
const pool = new Pool(DB_CONFIG);

// Lambda handler
const lambdaHandler = async (event) => {
    const client = await pool.connect();

    try {
        const body = JSON.parse(event.body);
        const userId = body.userId;
        const llmResponse = body.llmResponse;

        const songName = llmResponse.song.name;
        const artist = llmResponse.song.artist;
        const album = llmResponse.song.album || 'None';
        const genre = llmResponse.song.genre || null;
        const moodTags = llmResponse.song.mood_tags || [];
        const inputMessage = event.queryStringParameters.prompt;
        const responseMessage = llmResponse.message;

        // Begin a transaction
        await client.query('BEGIN');

        // Step 1: Ensure user exists in the `users` table
        const userCheckResult = await client.query(
            `
            SELECT id FROM users WHERE id = $1
            `,
            [userId]
        );

        if (userCheckResult.rows.length === 0) {
            // Insert user if not found
            await client.query(
                `
                INSERT INTO users (id, cognito_sub, username, email)
                VALUES ($1, $2, $3, $4)
                `,
                [userId, `cognito_${userId}`, `user_${userId}`, `user_${userId}@example.com`]
            );
        }

        // Step 2: Check if the song already exists
        const songCheckResult = await client.query(
            `
            SELECT id FROM songs
            WHERE song_name = $1 AND artist = $2 AND album = $3
            `,
            [songName, artist, album]
        );

        let songId;
        if (songCheckResult.rows.length > 0) {
            // Song already exists
            songId = songCheckResult.rows[0].id;

            // Optionally update genre if it's null or different
            await client.query(
                `
                UPDATE songs
                SET genre = $1
                WHERE id = $2 AND (genre IS NULL OR genre <> $1)
                `,
                [genre, songId]
            );
        } else {
            // Insert new song
            const songInsertResult = await client.query(
                `
                INSERT INTO songs (song_name, artist, album, genre)
                VALUES ($1, $2, $3, $4)
                RETURNING id
                `,
                [songName, artist, album, genre]
            );
            songId = songInsertResult.rows[0].id;
        }

        // Step 3: Insert LLM response into the `llm_responses` table
        const llmResponseResult = await client.query(
            `
            INSERT INTO llm_responses (user_id, input_message, response_message, song_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id
            `,
            [userId, inputMessage, responseMessage, songId]
        );
        const llmResponseId = llmResponseResult.rows[0].id;

        // Step 4: Insert mood tags into the `moods` and `llm_response_moods` tables
        for (const mood of moodTags) {
            // Check if the mood already exists
            const moodCheckResult = await client.query(
                `
                SELECT id FROM moods WHERE mood = $1
                `,
                [mood]
            );

            let moodId;
            if (moodCheckResult.rows.length > 0) {
                // Mood already exists
                moodId = moodCheckResult.rows[0].id;
            } else {
                // Insert new mood
                const moodInsertResult = await client.query(
                    `
                    INSERT INTO moods (mood)
                    VALUES ($1)
                    RETURNING id
                    `,
                    [mood]
                );
                moodId = moodInsertResult.rows[0].id;
            }

            // Link the mood to the LLM response
            await client.query(
                `
                INSERT INTO llm_response_moods (llm_response_id, mood_id)
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING
                `,
                [llmResponseId, moodId]
            );
        }

        // Commit the transaction
        await client.query('COMMIT');

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'LLM response stored successfully!' })
        };
    } catch (error) {
        console.error('Error storing LLM response:', error);

        // Rollback the transaction on error
        await client.query('ROLLBACK');

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to store LLM response.' })
        };
    } finally {
        client.release(); // Release the client back to the pool
    }
};

// Export as default for ES module compatibility
export default lambdaHandler;