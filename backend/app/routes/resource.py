from flask import Blueprint, jsonify, request
from app.models.resource import Resource
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db

resource_bp = Blueprint('resource', __name__)

@resource_bp.route('', methods=['GET'])
def get_resources():
    # Fetch all resources from the database
    resources = Resource.query.all()
    
    if not resources:
        # Provide some dummy data if database is empty for testing
        dummy_data = [
            {
                "id": 1,
                "title": "Managing Stress in the Workplace",
                "description": "Learn effective techniques to handle occupational stress and avoid burnout.",
                "type": "article",
                "content_url": "#"
            },
            {
                "id": 2,
                "title": "Breathing Exercises for Anxiety",
                "description": "A rapid 5-minute breathing routine to help center yourself during anxious moments.",
                "type": "video",
                "content_url": "#"
            },
            {
                "id": 3,
                "title": "Dr. Sarah Jenkins",
                "description": "Clinical Psychologist specializing in Anxiety and Depression.",
                "type": "counselor",
                "content_url": "#"
            }
        ]
        return jsonify(dummy_data), 200

    return jsonify([r.to_dict() for r in resources]), 200

@resource_bp.route('', methods=['POST'])
@jwt_required()
def create_resource():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return jsonify({"message": "Admin access required"}), 403
    
    data = request.get_json()
    new_resource = Resource(
        title=data.get('title'),
        description=data.get('description'),
        type=data.get('type'),
        content_url=data.get('content_url')
    )
    db.session.add(new_resource)
    db.session.commit()
    return jsonify(new_resource.to_dict()), 201

@resource_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_resource(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return jsonify({"message": "Admin access required"}), 403
        
    resource = Resource.query.get_or_404(id)
    db.session.delete(resource)
    db.session.commit()
    return jsonify({"message": "Resource deleted"}), 200
