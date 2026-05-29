import os
from datetime import timedelta

class Config:
    # Basic Configs
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-mental-health'
    
    # Database Configs - using SQLite for development
    basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'instance', 'database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configs
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-super-secure'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
