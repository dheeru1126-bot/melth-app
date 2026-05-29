from datetime import datetime

# In-memory store for active video rooms
# Structure: { room_id: { "started_at": datetime, "counselor_joined": bool } }
_active_rooms = {}

def start_room(room_id):
    """Mark a room as active when the counselor joins."""
    _active_rooms[room_id] = {
        "started_at": datetime.utcnow(),
        "counselor_joined": True
    }
    return True

def is_room_active(room_id):
    """Check if the counselor has started the room."""
    return _active_rooms.get(room_id, {}).get("counselor_joined", False)

def end_room(room_id):
    """Mark a room as inactive when the counselor leaves."""
    if room_id in _active_rooms:
        del _active_rooms[room_id]
    return True

def get_active_rooms():
    """Return all active rooms (for debugging/admin if needed)."""
    return _active_rooms
