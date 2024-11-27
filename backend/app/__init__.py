from flask import Flask
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

    return app

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
