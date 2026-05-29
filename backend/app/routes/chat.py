from flask import Blueprint, request, jsonify
from app import db, limiter
from app.models.chat import Chat
from app.services.ai_service import get_ai_response, detect_emotions, analyze_sentiment, detect_crisis
from flask_jwt_extended import jwt_required, get_jwt_identity

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('', methods=['POST'])
@jwt_required()
@limiter.limit("10 per minute")
def process_chat_message():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('message'):
        return jsonify({'message': 'Message is required'}), 400

    user_msg = data.get('message')
    
    # Detect emotions and sentiment
    emotions = detect_emotions(user_msg)
    emotion_tone, sentiment_score = analyze_sentiment(user_msg)
    is_crisis = detect_crisis(user_msg)
    
    # Fetch previous context
    recent_chats = Chat.query.filter_by(user_id=current_user_id).order_by(Chat.timestamp.desc()).limit(6).all()
    history_context = []
    for c in reversed(recent_chats):
        history_context.append({"role": "user", "content": c.message})
        history_context.append({"role": "assistant", "content": c.response})

    # 1. Get AI Response
    ai_reply = get_ai_response(user_msg, history_context, user_id=current_user_id)
    
    # 2. Save Conversation to Database
    new_chat = Chat(
        user_id=current_user_id,
        message=user_msg,
        response=ai_reply
    )
    
    try:
        db.session.add(new_chat)
        db.session.commit()
        
        return jsonify({
            'reply': ai_reply,
            'chat_id': new_chat.id,
            'detected_emotions': emotions,
            'sentiment': emotion_tone,
            'sentiment_score': sentiment_score,
            'is_crisis': is_crisis
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to process chat', 'error': str(e)}), 500


@chat_bp.route('/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    current_user_id = get_jwt_identity()
    
    # Get last 50 messages
    chats = Chat.query.filter_by(user_id=current_user_id).order_by(Chat.timestamp.desc()).limit(50).all()
    
    # Return chronologically
    return jsonify([chat.to_dict() for chat in reversed(chats)]), 200

@chat_bp.route('/emotional-summary', methods=['GET'])
@jwt_required()
def get_emotional_summary():
    """Get emotional summary from conversation history"""
    current_user_id = get_jwt_identity()
    
    # Get last 20 messages
    chats = Chat.query.filter_by(user_id=current_user_id).order_by(Chat.timestamp.desc()).limit(20).all()
    
    if not chats:
        return jsonify({
            'message': 'No chat history',
            'summary': 'Start chatting to track your emotional patterns'
        }), 200
    
    # Analyze emotions in messages
    all_emotions = []
    for chat in reversed(chats):
        emotions = detect_emotions(chat.message)
        all_emotions.extend(emotions)
    
    # Count emotion frequencies
    from collections import Counter
    emotion_counts = Counter(all_emotions)
    most_common = emotion_counts.most_common(3)
    
    return jsonify({
        'total_conversations': len(chats),
        'primary_emotions': [emotion for emotion, count in most_common],
        'emotion_distribution': dict(emotion_counts),
        'recommendations': get_recommendations_for_emotions(dict(emotion_counts))
    }), 200

def get_recommendations_for_emotions(emotions):
    """Generate recommendations based on detected emotions"""
    recommendations = []
    
    if emotions.get('anxiety', 0) > 0:
        recommendations.append("Try our grounding exercises to manage anxiety. Check the Exercises section!")
    
    if emotions.get('sadness', 0) > 0:
        recommendations.append("Consider reaching out to a counselor. Many are available for video or chat sessions.")
    
    if emotions.get('stress', 0) > 0:
        recommendations.append("Check out our meditation guides in Resources to reduce stress.")
    
    if emotions.get('loneliness', 0) > 0:
        recommendations.append("Connect with a counselor or try our community support section in Resources.")
    
    if not recommendations:
        recommendations.append("Keep tracking your emotions. Regular journaling helps identify patterns!")
    
    return recommendations

