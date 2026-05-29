from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import ThoughtRecord, GratitudeEntry, User
from app import db

exercise_bp = Blueprint('exercise', __name__)

@exercise_bp.route('/thought_record', methods=['POST'])
@jwt_required()
def save_thought_record():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('situation') or not data.get('automatic_thought') or not data.get('alternative_perspective'):
        return jsonify({"error": "Missing required fields"}), 400

    new_record = ThoughtRecord(
        user_id=user_id,
        situation=data['situation'],
        automatic_thought=data['automatic_thought'],
        alternative_perspective=data['alternative_perspective']
    )

    db.session.add(new_record)
    db.session.commit()

    return jsonify({"message": "Thought record saved successfully", "record": new_record.to_dict()}), 201

@exercise_bp.route('/thought_record', methods=['GET'])
@jwt_required()
def get_thought_records():
    user_id = get_jwt_identity()
    records = ThoughtRecord.query.filter_by(user_id=user_id).order_by(ThoughtRecord.created_at.desc()).all()
    return jsonify([record.to_dict() for record in records]), 200

@exercise_bp.route('/gratitude', methods=['POST'])
@jwt_required()
def save_gratitude():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('content'):
        return jsonify({"error": "Missing gratitude content"}), 400

    new_entry = GratitudeEntry(
        user_id=user_id,
        content=data['content']
    )

    db.session.add(new_entry)
    db.session.commit()

    return jsonify({"message": "Gratitude entry saved successfully", "entry": new_entry.to_dict()}), 201

@exercise_bp.route('/gratitude', methods=['GET'])
@jwt_required()
def get_gratitudes():
    user_id = get_jwt_identity()
    entries = GratitudeEntry.query.filter_by(user_id=user_id).order_by(GratitudeEntry.created_at.desc()).all()
    return jsonify([entry.to_dict() for entry in entries]), 200
