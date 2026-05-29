from flask import Blueprint, request, jsonify
from app import db
from app.models.notification import Notification
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

notification_bp = Blueprint('notifications', __name__)

@notification_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get all notifications for user"""
    current_user_id = get_jwt_identity()
    
    unread_only = request.args.get('unread_only', False, type=bool)
    limit = request.args.get('limit', 20, type=int)
    
    query = Notification.query.filter_by(user_id=current_user_id)
    
    if unread_only:
        query = query.filter_by(is_read=False)
    
    notifications = query.order_by(Notification.created_at.desc()).limit(limit).all()
    
    return jsonify({
        'data': [n.to_dict() for n in notifications],
        'total': len(notifications),
        'unread_count': Notification.query.filter_by(user_id=current_user_id, is_read=False).count()
    }), 200


@notification_bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_as_read(notification_id):
    """Mark notification as read"""
    current_user_id = get_jwt_identity()
    
    notification = Notification.query.filter_by(
        id=notification_id,
        user_id=current_user_id
    ).first()
    
    if not notification:
        return jsonify({'message': 'Notification not found'}), 404
    
    notification.is_read = True
    
    try:
        db.session.commit()
        return jsonify({'message': 'Notification marked as read'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update notification', 'error': str(e)}), 500


@notification_bp.route('/notifications/read-all', methods=['PUT'])
@jwt_required()
def mark_all_as_read():
    """Mark all notifications as read"""
    current_user_id = get_jwt_identity()
    
    try:
        Notification.query.filter_by(
            user_id=current_user_id,
            is_read=False
        ).update({'is_read': True})
        db.session.commit()
        
        return jsonify({'message': 'All notifications marked as read'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update notifications', 'error': str(e)}), 500


@notification_bp.route('/notifications/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """Delete a notification"""
    current_user_id = get_jwt_identity()
    
    notification = Notification.query.filter_by(
        id=notification_id,
        user_id=current_user_id
    ).first()
    
    if not notification:
        return jsonify({'message': 'Notification not found'}), 404
    
    try:
        db.session.delete(notification)
        db.session.commit()
        return jsonify({'message': 'Notification deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete notification', 'error': str(e)}), 500


def create_notification(user_id, title, message, notification_type, action_url=None):
    """Helper function to create notifications"""
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notification_type,
        action_url=action_url
    )
    try:
        db.session.add(notification)
        db.session.commit()
        return notification
    except Exception as e:
        db.session.rollback()
        print(f"Error creating notification: {e}")
        return None
