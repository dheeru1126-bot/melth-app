from app import db
from datetime import datetime

class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    counselor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='pending') # pending, accepted, rejected, canceled
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # We define relationships in user.py so no need to double define backrefs unless needed here.
    # user = db.relationship('User', foreign_keys=[user_id])
    # counselor = db.relationship('User', foreign_keys=[counselor_id])

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'counselor_id': self.counselor_id,
            'date': self.date,
            'time': self.time,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }
