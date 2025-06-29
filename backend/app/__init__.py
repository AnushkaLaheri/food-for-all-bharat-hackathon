from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # ✅ Use SQLALCHEMY config for PyMySQL
    app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = config.SECRET_KEY
    print("DB URI used:", app.config['SQLALCHEMY_DATABASE_URI'])

    db.init_app(app)

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    return app
