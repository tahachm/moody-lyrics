from config import DB_CONFIG
import json
import psycopg2
from psycopg2 import sql

def lambda_handler(event, context):
    
    try:
        # Parse incoming request
        body = json.loads(event["body"])
        user_id = body["userId"]
        llm_response = body["llmResponse"]

        song_name = llm_response["song"]["name"]
        artist = llm_response["song"]["artist"]
        album = llm_response["song"].get("album", "None")
        genre = llm_response["song"].get("genre", None)
        mood_tags = llm_response["song"].get("mood_tags", [])
        input_message = event["queryStringParameters"]["prompt"]
        response_message = llm_response["message"]

        # Connect to the database
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        # Step 1: Insert song into the `songs` table (if not already exists)
        cur.execute(
            """
            INSERT INTO songs (song_name, artist, album, genre)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (song_name, artist, album) DO UPDATE SET genre = EXCLUDED.genre
            RETURNING id
            """,
            (song_name, artist, album, genre)
        )
        song_id = cur.fetchone()[0]

        # Step 2: Insert LLM response into the `llm_responses` table
        cur.execute(
            """
            INSERT INTO llm_responses (user_id, input_message, response_message, song_id)
            VALUES (%s, %s, %s, %s)
            RETURNING id
            """,
            (user_id, input_message, response_message, song_id)
        )
        llm_response_id = cur.fetchone()[0]

        # Step 3: Insert mood tags into `llm_response_moods` table
        for mood in mood_tags:
            # Insert the mood into the `moods` table (if not already exists)
            cur.execute(
                """
                INSERT INTO moods (mood)
                VALUES (%s)
                ON CONFLICT (mood) DO NOTHING
                RETURNING id
                """,
                (mood,)
            )
            mood_id = cur.fetchone()
            if mood_id:
                mood_id = mood_id[0]

                # Link the mood to the LLM response
                cur.execute(
                    """
                    INSERT INTO llm_response_moods (llm_response_id, mood_id)
                    VALUES (%s, %s)
                    ON CONFLICT DO NOTHING
                    """,
                    (llm_response_id, mood_id)
                )

        # Commit the transaction
        conn.commit()

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "LLM response stored successfully!"})
        }

    except Exception as e:
        print(f"Error storing LLM response: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Failed to store LLM response."})
        }

    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
