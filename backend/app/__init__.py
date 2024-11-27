from flask import Flask
from flask import jsonify
import psycopg2
import os

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['DB_HOST'] = os.getenv('DB_HOST', 'localhost')
    app.config['DB_NAME'] = os.getenv('DB_NAME', 'music_db')
    app.config['DB_USER'] = os.getenv('DB_USER', 'postgres')
    app.config['DB_PASSWORD'] = os.getenv('DB_PASSWORD', '')

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
