from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # CORS setup for both local and deployed frontend
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000",  # for local testing
                "https://food-for-all-bharat-hackathon.vercel.app"  # for Vercel
            ]
        }
    }, supports_credentials=True)

    # DB Config
    app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config.SQLALCHEMY_TRACK_MODIFICATIONS
    app.secret_key = config.SECRET_KEY

    print("DB URI used:", app.config['SQLALCHEMY_DATABASE_URI'])

    db.init_app(app)

    # Register blueprints
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    return app
