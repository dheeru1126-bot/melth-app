from app import db
from datetime import datetime

class JournalEntry(db.Model):
    __tablename__ = 'journal_entries'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=True)
    content = db.Column(db.Text, nullable=False)
    emotion_tone = db.Column(db.String(50), nullable=True)  # positive, neutral, negative
    sentiment_score = db.Column(db.Float, nullable=True)  # -1 to 1
    is_private = db.Column(db.Boolean, default=True)
    tags = db.Column(db.String(255), nullable=True)  # comma-separated tags
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'content': self.content,
            'emotion_tone': self.emotion_tone,
            'sentiment_score': self.sentiment_score,
            'is_private': self.is_private,
            'tags': self.tags.split(',') if self.tags else [],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class ThoughtRecord(db.Model):
    __tablename__ = 'thought_records'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    situation = db.Column(db.Text, nullable=False)  # What happened
    automatic_thought = db.Column(db.Text, nullable=False)  # Initial thought
    emotion = db.Column(db.String(100), nullable=False)  # Emotion felt
    evidence_for = db.Column(db.Text, nullable=True)  # Supporting evidence
    evidence_against = db.Column(db.Text, nullable=True)  # Counter evidence
    rational_thought = db.Column(db.Text, nullable=True)  # Alternative thought
    outcome = db.Column(db.Text, nullable=True)  # Result
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'situation': self.situation,
            'automatic_thought': self.automatic_thought,
            'emotion': self.emotion,
            'evidence_for': self.evidence_for,
            'evidence_against': self.evidence_against,
            'rational_thought': self.rational_thought,
            'outcome': self.outcome,
            'created_at': self.created_at.isoformat()
        }


class GratitudeEntry(db.Model):
    __tablename__ = 'gratitude_entries'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=True)  # person, experience, possession
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'content': self.content,
            'category': self.category,
            'created_at': self.created_at.isoformat()
        }
