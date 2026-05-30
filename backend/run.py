from dotenv import load_dotenv
load_dotenv()
import os
from app import create_app, db
from app.models.user import User
from app.models.mood import Mood
from app.models.chat import Chat
from app.models.resource import Resource

app = create_app()

# Create instance folder if it doesn't exist
os.makedirs(os.path.join(os.path.dirname(__file__), 'instance'), exist_ok=True)

@app.cli.command("init-db")
def init_db():
    """Create database tables."""
    with app.app_context():
        db.create_all()
        print("Database initialized successfully.")

with app.app_context():
    db.create_all()
    from app import bcrypt
    admin = User.query.filter_by(role='admin').first()
    if not admin:
        admin_password = bcrypt.generate_password_hash('Admin123!').decode('utf-8')
        admin_user = User(
            name='Melth Admin',
            email='admin@melth.com',
            password_hash=admin_password,
            role='admin'
        )
        db.session.add(admin_user)
        db.session.commit()
        print("Default admin created successfully on startup.")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
