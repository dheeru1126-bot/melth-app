from flask import Blueprint, request, jsonify
from app import db, bcrypt
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import cross_origin
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin()
def register():
    # Handle preflight
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    data = request.get_json()
    email = data.get('email', '').strip().lower()
    
    if not email or not data.get('password') or not data.get('name'):
        return jsonify({'message': 'Missing required fields: name, email, password'}), 400

    # Ensure user does not already exist
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already registered'}), 409

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    role = data.get('role', 'user')
    title = data.get('title') if role == 'counselor' else None
    specialty = data.get('specialty') if role == 'counselor' else None

    # Create new user
    new_user = User(
        name=data['name'],
        email=data['email'],
        password_hash=hashed_password,
        role=role,
        title=title,
        specialty=specialty
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully', 'user': new_user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to register user', 'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin()
def login():
    # Handle preflight
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    data = request.get_json()

    email = data.get('email', '').strip().lower()
    if not email or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400

    requested_role = data.get('role', 'user')

    user = User.query.filter_by(email=email).first()
    print("DEBUG LOGIN:", data['email'], user, user.password_hash if user else None)
    if user:
        print("DEBUG BCRYPT:", bcrypt.check_password_hash(user.password_hash, data['password']))

    # Verify user exists and password is correct
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        
        # Verify role match (Admin bypasses these checks)
        if user.role != 'admin':
            if requested_role == 'counselor' and user.role != 'counselor':
                return jsonify({'message': 'Access denied: You are not a registered counselor.'}), 403
                
            if requested_role == 'user' and user.role == 'counselor':
                return jsonify({'message': 'Access denied: Please log in using the Counselor tab.'}), 403

        # Create JWT Token
        expires = datetime.timedelta(days=7)
        access_token = create_access_token(identity=str(user.id), expires_delta=expires)
        
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': user.to_dict()
        }), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    return jsonify({'user': user.to_dict()}), 200

@auth_bp.route('/me', methods=['PUT', 'OPTIONS'])
@cross_origin()
@jwt_required()
def update_current_user():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    data = request.get_json()
    
    # Check if email is already tracked by another user
    if 'email' in data and data['email'] != user.email:
        existing = User.query.filter_by(email=data['email']).first()
        if existing:
            return jsonify({'message': 'Email already in use'}), 409
            
        user.email = data['email']
        
    if 'name' in data:
        user.name = data['name']
        
    if 'password' in data and data['password']:
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user.password_hash = hashed_password
        
    if 'daily_reminder_enabled' in data:
        user.daily_reminder_enabled = data['daily_reminder_enabled']

    db.session.commit()
    return jsonify({'message': 'Profile updated successfully', 'user': user.to_dict()}), 200

@auth_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_platform_stats():
    """Returns platform wide statistics for counselors and admins."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.role not in ['admin', 'counselor']:
        return jsonify({'message': 'Access denied'}), 403
        
    # Count total patients
    total_patients = User.query.filter_by(role='user').count()
    
    return jsonify({
        'total_patients': total_patients
    }), 200

@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    """Returns all users for admin dashboard."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.role != 'admin':
        return jsonify({'message': 'Access denied'}), 403
        
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200

@auth_bp.route('/reset-password', methods=['POST', 'OPTIONS'])
@cross_origin()
def reset_password():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('newPassword')
    
    if not email or not new_password:
        return jsonify({'message': 'Email and new password are required'}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'No account associated with this email was found.'}), 404
        
    user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    db.session.commit()
    
    return jsonify({'message': 'Password has been reset successfully. You can now log in with your new credentials.'}), 200
