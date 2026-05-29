from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user') # user, admin, counselor
    title = db.Column(db.String(100), nullable=True)
    specialty = db.Column(db.String(150), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    moods = db.relationship('Mood', backref='user', lazy=True)
    chats = db.relationship('Chat', backref='user', lazy=True)
    journal_entries = db.relationship('JournalEntry', backref='user', lazy=True)
    thought_records = db.relationship('ThoughtRecord', backref='user', lazy=True)
    gratitude_entries = db.relationship('GratitudeEntry', backref='user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)
    
    # Remote side is needed since both point to User
    appointments_as_user = db.relationship('Appointment', foreign_keys='Appointment.user_id', backref='patient', lazy=True)
    appointments_as_counselor = db.relationship('Appointment', foreign_keys='Appointment.counselor_id', backref='counselor_details', lazy=True)

    daily_reminder_enabled = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'title': self.title,
            'specialty': self.specialty,
            'is_admin': self.role == 'admin',
            'daily_reminder_enabled': self.daily_reminder_enabled,
            'created_at': self.created_at.isoformat()
        }
