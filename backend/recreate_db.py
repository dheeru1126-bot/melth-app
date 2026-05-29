import os
from app import create_app, db, bcrypt
from app.models.user import User
from app.models.resource import Resource

app = create_app()

with app.app_context():
    print("Dropping all tables...")
    db.drop_all()
    print("Creating all tables...")
    db.create_all()

    # Create Primary Admin User
    admin_password = bcrypt.generate_password_hash('Admin123!').decode('utf-8')
    admin_user = User(
        name='Melth Admin',
        email='admin@melth.com',
        password_hash=admin_password,
        role='admin'
    )
    db.session.add(admin_user)

    # Add the specific test user requested (Optional, but helpful for user to log in)
    lokesh_password = bcrypt.generate_password_hash('kmit123').decode('utf-8')
    lokesh_user = User(
        name='Lokesh',
        email='a@gmail.com',
        password_hash=lokesh_password,
        role='user'
    )
    db.session.add(lokesh_user)

    db.session.commit()
    print("Database cleared. Only Admin and test account 'a@gmail.com' remain.")
    print("All demo counselors and appointments have been removed.")
