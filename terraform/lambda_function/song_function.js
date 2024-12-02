import pkg from 'pg';
const { Pool } = pkg; // Destructure Pool from the default export
import DB_CONFIG from './config.js'; // Import your database config

// Create a connection pool
const pool = new Pool(DB_CONFIG);

// Lambda handler
const lambdaHandler = async (event) => {
    console.log('Event received:', event);
    // Handle OPTIONS preflight requests
    if (event.requestContext.http.method === "OPTIONS") {
        console.log('Handling OPTIONS preflight request...');
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Replace '*' with your frontend domain in production
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Allowed methods
                "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allowed headers
            },
            body: null, // No body needed for OPTIONS response
        };
    }

    // Proceed with handling POST requests
    const client = await pool.connect();
    console.log('Step 1: Database connection established.');

    try {
        console.log('Step 2: Parsing input...');
        const body = JSON.parse(event.body);
        const { userId, username, email, llmResponse, prompt } = body;

        if (!userId || !username || !email) {
            throw new Error("Missing required fields: userId, username, or email.");
        }

        const songName = llmResponse.song.name;
        const artist = llmResponse.song.artist;
        const album = llmResponse.song.album || 'None';
        const genre = llmResponse.song.genre || null;
        const moodTags = llmResponse.song.mood_tags || [];
        const inputMessage = prompt;
        const responseMessage = llmResponse.message;

        console.log('Step 3: Starting transaction...');
        await client.query('BEGIN');

        // Step 4: Ensure user exists in the `users` table
        console.log('Step 4: Checking if user exists...');
        const userCheckResult = await client.query(
            `
            SELECT id FROM users WHERE id = $1
            `,
            [userId]
        );

        if (userCheckResult.rows.length === 0) {
            console.log('Step 4.1: User not found. Inserting new user...');
            await client.query(
                `
                INSERT INTO users (id, cognito_sub, username, email)
                VALUES ($1, $2, $3, $4)
                `,
                [userId, `cognito_${userId}`, username, email]
            );
        } else {
            console.log('Step 4.2: User exists.');
        }

        // Step 5: Check if the song already exists
        console.log('Step 5: Checking if song exists...');
        const songCheckResult = await client.query(
            `
            SELECT id FROM songs
            WHERE song_name = $1 AND artist = $2 AND album = $3
            `,
            [songName, artist, album]
        );

        let songId;
        if (songCheckResult.rows.length > 0) {
            console.log('Step 5.1: Song exists. Updating genre if necessary...');
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
            console.log('Step 5.2: Song not found. Inserting new song...');
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

        // Step 6: Insert LLM response into the `llm_responses` table
        console.log('Step 6: Inserting LLM response...');
        const llmResponseResult = await client.query(
            `
            INSERT INTO llm_responses (user_id, input_message, response_message, song_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id
            `,
            [userId, inputMessage, responseMessage, songId]
        );
        const llmResponseId = llmResponseResult.rows[0].id;

        // Step 7: Insert mood tags into the `moods` and `llm_response_moods` tables
        console.log('Step 7: Processing mood tags...');
        for (const mood of moodTags) {
            console.log(`Step 7.1: Checking if mood "${mood}" exists...`);
            const moodCheckResult = await client.query(
                `
                SELECT id FROM moods WHERE mood = $1
                `,
                [mood]
            );

            let moodId;
            if (moodCheckResult.rows.length > 0) {
                console.log(`Step 7.2: Mood "${mood}" exists.`);
                moodId = moodCheckResult.rows[0].id;
            } else {
                console.log(`Step 7.3: Mood "${mood}" not found. Inserting new mood...`);
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

            console.log(`Step 7.4: Linking mood "${mood}" to the LLM response...`);
            await client.query(
                `
                INSERT INTO llm_response_moods (llm_response_id, mood_id)
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING
                `,
                [llmResponseId, moodId]
            );
        }

        console.log('Step 8: Committing transaction...');
        await client.query('COMMIT');

        console.log('Step 9: Returning success response...');
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Replace '*' with your frontend domain in production
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Allowed methods
                "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allowed headers
            },
            body: JSON.stringify({ message: 'LLM response stored successfully!' }),
        };
    } catch (error) {
        console.error('Error storing LLM response:', error);

        console.log('Rolling back transaction...');
        await client.query('ROLLBACK');

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // Replace '*' with your frontend domain in production
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            body: JSON.stringify({ error: error || 'Failed to store LLM response.' }),
        };
    } finally {
        console.log('Releasing database connection...');
        client.release(); // Release the client back to the pool
    }
};

// Export as default for ES module compatibility
export default lambdaHandler;
