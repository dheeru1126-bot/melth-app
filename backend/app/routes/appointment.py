from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Appointment, User
from app import db

appointment_bp = Blueprint('appointment', __name__)

@appointment_bp.route('', methods=['POST'])
@jwt_required()
def create_appointment():
    user_id = get_jwt_identity()
    data = request.get_json()

    new_app = Appointment(
        user_id=user_id,
        counselor_id=data.get('counselor_id'),
        date=data.get('date'),
        time=data.get('time'),
        notes=data.get('notes', '')
    )

    db.session.add(new_app)
    db.session.commit()
    return jsonify({"message": "Appointment created", "appointment": new_app.to_dict()}), 201

@appointment_bp.route('', methods=['GET'])
@jwt_required()
def get_appointments():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if user.role == 'counselor':
        appointments = Appointment.query.filter_by(counselor_id=user_id).all()
    elif user.role == 'admin':
        appointments = Appointment.query.all()
    else:
        appointments = Appointment.query.filter_by(user_id=user_id).all()
        
    res = []
    for appt in appointments:
        d = appt.to_dict()
        patient = User.query.get(appt.user_id)
        counselor = User.query.get(appt.counselor_id)
        d['patient_name'] = patient.name if patient else 'Unknown'
        d['counselor_name'] = counselor.name if counselor else 'Unknown'
        res.append(d)

    return jsonify(res), 200

@appointment_bp.route('/<int:id>/status', methods=['PUT'])
@jwt_required()
def update_status(id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    data = request.get_json()
    new_status = data.get('status')
    
    appointment = Appointment.query.get_or_404(id)
    
    if user.role == 'admin':
        appointment.status = new_status
    elif user.role == 'counselor' and appointment.counselor_id == user_id:
        appointment.status = new_status
    elif user.role == 'user' and appointment.user_id == user_id and new_status == 'canceled':
        appointment.status = new_status
    else:
        return jsonify({"message": "Unauthorized"}), 403
        
    db.session.commit()
    return jsonify({"message": f"Status updated to {new_status}"}), 200

@appointment_bp.route('/counselors', methods=['GET'])
@jwt_required()
def get_counselors():
    counselors = User.query.filter_by(role='counselor').all()
    return jsonify([c.to_dict() for c in counselors]), 200

