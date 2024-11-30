from app import create_app, create_tables, insert_dummy_data
from app.routes import routes
from flask_cors import CORS  

app = create_app()
CORS(app, resources={r"/*": {"origins": "*"}})
app.register_blueprint(routes)

if __name__ == '__main__':
    create_tables()
    insert_dummy_data()
    app.run(debug=True, host='0.0.0.0', port=5000)
