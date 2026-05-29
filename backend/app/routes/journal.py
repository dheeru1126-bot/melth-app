from flask import Blueprint, request, jsonify
from app import db
from app.models.journal import JournalEntry, ThoughtRecord, GratitudeEntry
from app.services.ai_service import analyze_sentiment
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta

journal_bp = Blueprint('journal', __name__)

# ============ JOURNAL ENTRIES ============

@journal_bp.route('/journal', methods=['POST'])
@jwt_required()
def create_journal_entry():
    """Create a new journal entry"""
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('content'):
        return jsonify({'message': 'Content is required'}), 400

    emotion_tone, sentiment_score = analyze_sentiment(data.get('content'))

    new_entry = JournalEntry(
        user_id=current_user_id,
        title=data.get('title', ''),
        content=data.get('content'),
        emotion_tone=emotion_tone,
        sentiment_score=sentiment_score,
        is_private=data.get('is_private', True),
        tags=','.join(data.get('tags', [])) if data.get('tags') else None
    )

    try:
        db.session.add(new_entry)
        db.session.commit()
        return jsonify({'message': 'Journal entry created successfully', 'data': new_entry.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create journal entry', 'error': str(e)}), 500


@journal_bp.route('/journal', methods=['GET'])
@jwt_required()
def get_journal_entries():
    """Get all journal entries for user"""
    current_user_id = get_jwt_identity()
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    entries = JournalEntry.query.filter_by(user_id=current_user_id).order_by(
        JournalEntry.created_at.desc()
    ).paginate(page=page, per_page=per_page)
    
    return jsonify({
        'data': [entry.to_dict() for entry in entries.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': entries.total,
            'pages': entries.pages
        }
    }), 200


@journal_bp.route('/journal/<int:entry_id>', methods=['GET'])
@jwt_required()
def get_journal_entry(entry_id):
    """Get a specific journal entry"""
    current_user_id = get_jwt_identity()
    entry = JournalEntry.query.filter_by(id=entry_id, user_id=current_user_id).first()
    
    if not entry:
        return jsonify({'message': 'Journal entry not found'}), 404
    
    return jsonify(entry.to_dict()), 200


@journal_bp.route('/journal/<int:entry_id>', methods=['PUT'])
@jwt_required()
def update_journal_entry(entry_id):
    """Update a journal entry"""
    current_user_id = get_jwt_identity()
    entry = JournalEntry.query.filter_by(id=entry_id, user_id=current_user_id).first()
    
    if not entry:
        return jsonify({'message': 'Journal entry not found'}), 404
    
    data = request.get_json()
    
    if 'content' in data:
        entry.content = data['content']
        emotion_tone, sentiment_score = analyze_sentiment(data['content'])
        entry.emotion_tone = emotion_tone
        entry.sentiment_score = sentiment_score
    
    if 'title' in data:
        entry.title = data['title']
    if 'tags' in data:
        entry.tags = ','.join(data['tags']) if data['tags'] else None
    if 'is_private' in data:
        entry.is_private = data['is_private']
    
    entry.updated_at = datetime.utcnow()
    
    try:
        db.session.commit()
        return jsonify({'message': 'Journal entry updated successfully', 'data': entry.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update journal entry', 'error': str(e)}), 500


@journal_bp.route('/journal/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_journal_entry(entry_id):
    """Delete a journal entry"""
    current_user_id = get_jwt_identity()
    entry = JournalEntry.query.filter_by(id=entry_id, user_id=current_user_id).first()
    
    if not entry:
        return jsonify({'message': 'Journal entry not found'}), 404
    
    try:
        db.session.delete(entry)
        db.session.commit()
        return jsonify({'message': 'Journal entry deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete journal entry', 'error': str(e)}), 500


@journal_bp.route('/journal/all', methods=['DELETE'])
@jwt_required()
def delete_all_journal_entries():
    """Delete all journal entries for user"""
    current_user_id = get_jwt_identity()
    try:
        JournalEntry.query.filter_by(user_id=current_user_id).delete()
        db.session.commit()
        return jsonify({'message': 'All journal entries deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete journal entries', 'error': str(e)}), 500


@journal_bp.route('/journal/sentiment-analysis', methods=['GET'])
@jwt_required()
def get_sentiment_analysis():
    """Get sentiment analysis over time"""
    current_user_id = get_jwt_identity()
    days = request.args.get('days', 30, type=int)
    
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    entries = JournalEntry.query.filter_by(user_id=current_user_id).filter(
        JournalEntry.created_at >= cutoff_date
    ).order_by(JournalEntry.created_at).all()
    
    sentiment_data = []
    for entry in entries:
        sentiment_data.append({
            'date': entry.created_at.isoformat(),
            'sentiment_score': entry.sentiment_score,
            'emotion_tone': entry.emotion_tone,
            'title': entry.title
        })
    
    # Calculate averages
    if sentiment_data:
        avg_sentiment = sum(s['sentiment_score'] or 0 for s in sentiment_data) / len(sentiment_data)
    else:
        avg_sentiment = 0
    
    return jsonify({
        'data': sentiment_data,
        'average_sentiment': avg_sentiment,
        'total_entries': len(entries)
    }), 200


# ============ THOUGHT RECORDS ============

@journal_bp.route('/thought-record', methods=['POST'])
@jwt_required()
def create_thought_record():
    """Create a CBT thought record"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['situation', 'automatic_thought', 'emotion']
    if not all(data.get(field) for field in required_fields):
        return jsonify({'message': 'Situation, automatic thought, and emotion are required'}), 400
    
    new_record = ThoughtRecord(
        user_id=current_user_id,
        situation=data.get('situation'),
        automatic_thought=data.get('automatic_thought'),
        emotion=data.get('emotion'),
        evidence_for=data.get('evidence_for'),
        evidence_against=data.get('evidence_against'),
        rational_thought=data.get('rational_thought'),
        outcome=data.get('outcome')
    )
    
    try:
        db.session.add(new_record)
        db.session.commit()
        return jsonify({'message': 'Thought record created successfully', 'data': new_record.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create thought record', 'error': str(e)}), 500


@journal_bp.route('/thought-record', methods=['GET'])
@jwt_required()
def get_thought_records():
    """Get all thought records for user"""
    current_user_id = get_jwt_identity()
    records = ThoughtRecord.query.filter_by(user_id=current_user_id).order_by(
        ThoughtRecord.created_at.desc()
    ).all()
    return jsonify([record.to_dict() for record in records]), 200


@journal_bp.route('/thought-record/<int:record_id>', methods=['PUT'])
@jwt_required()
def update_thought_record(record_id):
    """Update a thought record"""
    current_user_id = get_jwt_identity()
    record = ThoughtRecord.query.filter_by(id=record_id, user_id=current_user_id).first()
    
    if not record:
        return jsonify({'message': 'Thought record not found'}), 404
    
    data = request.get_json()
    for field in ['situation', 'automatic_thought', 'emotion', 'evidence_for', 'evidence_against', 'rational_thought', 'outcome']:
        if field in data:
            setattr(record, field, data[field])
    
    try:
        db.session.commit()
        return jsonify({'message': 'Thought record updated successfully', 'data': record.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update thought record', 'error': str(e)}), 500


@journal_bp.route('/thought-record/<int:record_id>', methods=['DELETE'])
@jwt_required()
def delete_thought_record(record_id):
    """Delete a thought record"""
    current_user_id = get_jwt_identity()
    record = ThoughtRecord.query.filter_by(id=record_id, user_id=current_user_id).first()
    if not record:
        return jsonify({'message': 'Thought record not found'}), 404
    try:
        db.session.delete(record)
        db.session.commit()
        return jsonify({'message': 'Thought record deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete thought record', 'error': str(e)}), 500


@journal_bp.route('/thought-record/all', methods=['DELETE'])
@jwt_required()
def delete_all_thought_records():
    """Delete all thought records for user"""
    current_user_id = get_jwt_identity()
    try:
        ThoughtRecord.query.filter_by(user_id=current_user_id).delete()
        db.session.commit()
        return jsonify({'message': 'All thought records deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete thought records', 'error': str(e)}), 500


# ============ GRATITUDE ENTRIES ============

@journal_bp.route('/gratitude', methods=['POST'])
@jwt_required()
def create_gratitude_entry():
    """Create a gratitude entry"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('content'):
        return jsonify({'message': 'Content is required'}), 400
    
    new_entry = GratitudeEntry(
        user_id=current_user_id,
        content=data.get('content'),
        category=data.get('category')
    )
    
    try:
        db.session.add(new_entry)
        db.session.commit()
        return jsonify({'message': 'Gratitude entry created successfully', 'data': new_entry.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create gratitude entry', 'error': str(e)}), 500


@journal_bp.route('/gratitude', methods=['GET'])
@jwt_required()
def get_gratitude_entries():
    """Get all gratitude entries for user"""
    current_user_id = get_jwt_identity()
    days = request.args.get('days', 30, type=int)
    
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    entries = GratitudeEntry.query.filter_by(user_id=current_user_id).filter(
        GratitudeEntry.created_at >= cutoff_date
    ).order_by(GratitudeEntry.created_at.desc()).all()
    
    return jsonify([entry.to_dict() for entry in entries]), 200


@journal_bp.route('/gratitude/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_gratitude_entry(entry_id):
    """Delete a gratitude entry"""
    current_user_id = get_jwt_identity()
    entry = GratitudeEntry.query.filter_by(id=entry_id, user_id=current_user_id).first()
    if not entry:
        return jsonify({'message': 'Gratitude entry not found'}), 404
    try:
        db.session.delete(entry)
        db.session.commit()
        return jsonify({'message': 'Gratitude entry deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete gratitude entry', 'error': str(e)}), 500


@journal_bp.route('/gratitude/all', methods=['DELETE'])
@jwt_required()
def delete_all_gratitude_entries():
    """Delete all gratitude entries for user"""
    current_user_id = get_jwt_identity()
    try:
        GratitudeEntry.query.filter_by(user_id=current_user_id).delete()
        db.session.commit()
        return jsonify({'message': 'All gratitude entries deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete gratitude entries', 'error': str(e)}), 500
