from flask import Flask
from flask import jsonify
import psycopg2

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['DB_HOST'] = 'database-1.cluster-ctwkoq0ogzgp.us-east-1.rds.amazonaws.com' #'localhost' # Change if running on a different host
    app.config['DB_NAME'] = 'music_db'   # Replace with your database name
    app.config['DB_USER'] = 'postgres'   # Replace with your DB username
    app.config['DB_PASSWORD'] = 'mustafa1441'  # Replace with your DB password
    
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
