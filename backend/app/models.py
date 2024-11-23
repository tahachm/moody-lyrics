from app import get_db_connection

def get_mood_frequencies():
    """
    Fetch mood frequencies from the database.
    Returns:
        List[Dict]: List of moods and their frequencies.
    """
    query = """
    SELECT 
        m.mood AS text,
        COUNT(lrm.id) AS value
    FROM 
        moods m
    JOIN 
        llm_response_moods lrm ON m.id = lrm.mood_id
    GROUP BY 
        m.mood
    ORDER BY 
        value DESC;
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    
    # Format results as a list of dictionaries
    return [{"text": row[0], "value": row[1]} for row in results]

def get_song_frequencies():
    """
    Fetch song suggestion frequencies from the database.
    Returns:
        List[Dict]: List of songs and their suggestion counts.
    """
    query = """
    SELECT 
        s.song_name AS text,
        COUNT(lr.id) AS value
    FROM 
        songs s
    JOIN 
        llm_responses lr ON s.id = lr.song_id
    GROUP BY 
        s.song_name
    ORDER BY 
        value DESC;
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    
    # Format results as a list of dictionaries
    return [{"text": row[0], "value": row[1]} for row in results]

def get_user_ranks():
    """
    Fetch the rank of users based on the number of recommendations they received.
    Returns:
        List[Dict]: List of users, their recommendation counts, and ranks.
    """
    query = """
    WITH user_counts AS (
        SELECT 
            u.id AS user_id,
            u.username AS text,
            COUNT(lr.id) AS value
        FROM 
            users u
        JOIN 
            llm_responses lr ON u.id = lr.user_id
        GROUP BY 
            u.id, u.username
    )
    SELECT 
        text,
        value,
        RANK() OVER (ORDER BY value DESC) AS rank
    FROM 
        user_counts;
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    
    # Format results as a list of dictionaries
    return [{"text": row[0], "value": row[1], "rank": row[2]} for row in results]
