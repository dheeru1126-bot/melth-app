from flask import Blueprint, jsonify, request
from app.services.video_service import start_room, is_room_active, end_room

video_bp = Blueprint('video', __name__)

@video_bp.route('/room/<room_id>/start', methods=['POST'])
def handle_start_room(room_id):
    """Called by the counselor to start the video room."""
    # Ideally, we would verify the user's role and identity here using JWT.
    # For now, we trust the caller (counselor) based on their route access.
    success = start_room(room_id)
    print(f"DEBUG: Counselor started room {room_id}")
    return jsonify({"success": success, "message": "Room started successfully."}), 200

@video_bp.route('/room/<room_id>/status', methods=['GET'])
def handle_room_status(room_id):
    """Polled by the patient to check if the room is active."""
    active = is_room_active(room_id)
    print(f"DEBUG: Patient checking status of room {room_id}: Active={active}")
    return jsonify({"active": active}), 200

@video_bp.route('/room/<room_id>/end', methods=['POST'])
def handle_end_room(room_id):
    """Called when the counselor leaves the room."""
    success = end_room(room_id)
    print(f"DEBUG: Counselor ended room {room_id}")
    return jsonify({"success": success, "message": "Room ended successfully."}), 200
