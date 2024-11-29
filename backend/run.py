from app import create_app, create_tables, insert_dummy_data
from app.routes import routes

app = create_app()
app.register_blueprint(routes)

if __name__ == '__main__':
    create_tables()
    insert_dummy_data()
    app.run(debug=True, host='0.0.0.0', port=5000)
