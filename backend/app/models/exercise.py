from app import db
from datetime import datetime

# Exercise tracking model
class Exercise(db.Model):
    __tablename__ = 'exercises'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    exercise_name = db.Column(db.String(255), nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=True)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'exercise_name': self.exercise_name,
            'duration_minutes': self.duration_minutes,
            'completed_at': self.completed_at.isoformat()
        }
