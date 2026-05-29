from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from .config import Config

# Initialize extensions
db = SQLAlchemy()
cors = CORS()
jwt = JWTManager()
bcrypt = Bcrypt()
limiter = Limiter(key_func=get_remote_address)

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions with app
    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    jwt.init_app(app)
    bcrypt.init_app(app)
    limiter.init_app(app)

    # Register blueprints (routes)
    from .routes.auth import auth_bp
    from .routes.mood import mood_bp
    from .routes.chat import chat_bp
    from .routes.resource import resource_bp
    from .routes.exercise import exercise_bp
    from .routes.appointment import appointment_bp
    from .routes.journal import journal_bp
    from .routes.notification import notification_bp
    from .routes.video import video_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(mood_bp, url_prefix='/api/mood')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(resource_bp, url_prefix='/api/resources')
    app.register_blueprint(exercise_bp, url_prefix='/api/exercises')
    app.register_blueprint(appointment_bp, url_prefix='/api/appointments')
    app.register_blueprint(journal_bp, url_prefix='/api')
    app.register_blueprint(notification_bp, url_prefix='/api')
    app.register_blueprint(video_bp, url_prefix='/api/video')

    return app
