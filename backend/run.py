from app import create_app, create_tables
from app.routes import routes

app = create_app()
app.register_blueprint(routes)

if __name__ == '__main__':
    create_tables()
    app.run(debug=True, host='0.0.0.0', port=5000)
