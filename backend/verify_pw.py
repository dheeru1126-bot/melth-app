from app import create_app, db, bcrypt
from app.models.user import User

app = create_app()
with app.app_context():
    user = User.query.filter_by(email='a@gmail.com').first()
    if user:
        print(f"User: {user.name} ({user.email})")
        print(f"Role: {user.role}")
        print(f"Password Check (kmit123): {bcrypt.check_password_hash(user.password_hash, 'kmit123')}")
    else:
        print("User a@gmail.com not found")
