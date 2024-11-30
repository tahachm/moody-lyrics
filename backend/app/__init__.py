from flask import Flask
from flask_cors import CORS
from flask import jsonify
import psycopg2
import os

def create_app():
    app = Flask(__name__)
    
    # Configuration
    db_host = os.getenv('DB_HOST', 'localhost')
    db_host_parts = db_host.split(':') if ':' in db_host else [db_host, '5432']

    app.config['DB_HOST'] = db_host_parts[0]
    app.config['DB_PORT'] = int(db_host_parts[1])  # Use the default port 5432 if not specified
    app.config['DB_NAME'] = os.getenv('DB_NAME', 'music_db')
    app.config['DB_USER'] = os.getenv('DB_USER', 'postgres')
    app.config['DB_PASSWORD'] = os.getenv('DB_PASSWORD', 'securepassword123')

    CORS(app, resources={r"/*": {"origins": "*"}})
    return app

# SQL commands to create tables
TABLES = [
    """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        cognito_sub VARCHAR(50) NOT NULL UNIQUE,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS songs (
        id SERIAL PRIMARY KEY,
        song_name VARCHAR(150) NOT NULL,
        artist VARCHAR(100) NOT NULL,
        album VARCHAR(100),
        genre VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS moods (
        id SERIAL PRIMARY KEY,
        mood VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS llm_responses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        input_message TEXT NOT NULL,
        response_message TEXT NOT NULL,
        song_id INTEGER REFERENCES songs(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS llm_response_moods (
        id SERIAL PRIMARY KEY,
        llm_response_id INTEGER REFERENCES llm_responses(id) ON DELETE CASCADE,
        mood_id INTEGER REFERENCES moods(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
]

DUMMY_DATA = [
    """
    INSERT INTO users (cognito_sub, username, email)
    VALUES 
        ('sub-12345', 'john_doe', 'john.doe@example.com'),
        ('sub-67890', 'jane_smith', 'jane.smith@example.com')
    ON CONFLICT (cognito_sub) DO NOTHING;
    """,
    """
    INSERT INTO songs (song_name, artist, album, genre)
    VALUES 
        ('Happy', 'Pharrell Williams', 'G I R L', 'Pop'),
        ('Weightless', 'Marconi Union', NULL, 'Ambient')
    ON CONFLICT DO NOTHING;
    """,
    """
    INSERT INTO moods (mood)
    VALUES 
        ('happy'), 
        ('energetic'), 
        ('calm'), 
        ('sad')
    ON CONFLICT (mood) DO NOTHING;
    """,
    """
    INSERT INTO llm_responses (user_id, input_message, response_message, song_id)
    VALUES 
        (1, 'I feel like celebrating today!', 'Try listening to "Happy"!', 1),
        (2, 'I need something relaxing.', 'How about "Weightless"?', 2)
    ON CONFLICT DO NOTHING;
    """,
    """
    INSERT INTO llm_response_moods (llm_response_id, mood_id)
    VALUES 
        (1, 1), 
        (1, 2), 
        (2, 3), 
        (2, 4)
    ON CONFLICT DO NOTHING;
    """
]

def create_tables():
    try:
        # Connect to the database
        connection = get_db_connection()
        cursor = connection.cursor()

        # Create tables
        for table_sql in TABLES:
            cursor.execute(table_sql)
        
        # Commit and close
        connection.commit()
        print("Tables created successfully.")
    except Exception as e:
        print(f"Error creating tables: {e}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def insert_dummy_data():
    try:
        # Connect to the database
        connection = get_db_connection()
        cursor = connection.cursor()

        # Insert dummy data
        for data_sql in DUMMY_DATA:
            cursor.execute(data_sql)
        
        # Commit changes
        connection.commit()
        print("Dummy data inserted successfully.")
    except Exception as e:
        print(f"Error inserting dummy data: {e}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# Database connection
def get_db_connection():
    app = create_app()
    connection = psycopg2.connect(
        host=app.config['DB_HOST'],
        database=app.config['DB_NAME'],
        user=app.config['DB_USER'],
        password=app.config['DB_PASSWORD']
    )
    return connection
