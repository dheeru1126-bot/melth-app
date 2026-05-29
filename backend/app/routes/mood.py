from flask import Blueprint, request, jsonify
from app import db
from app.models.mood import Mood
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from collections import Counter

mood_bp = Blueprint('mood', __name__)

MOOD_SCORES = {
    'happy': 90,
    'neutral': 60,
    'anxious': 40,
    'sad': 30,
    'angry': 20
}

@mood_bp.route('', methods=['POST'])
@jwt_required()
def log_mood():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('mood'):
        return jsonify({'message': 'Mood is required'}), 400

    new_mood = Mood(
        user_id=current_user_id,
        mood=data.get('mood'),
        note=data.get('note', '')
    )

    try:
        db.session.add(new_mood)
        db.session.commit()
        return jsonify({'message': 'Mood logged successfully', 'data': new_mood.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to log mood', 'error': str(e)}), 500

@mood_bp.route('', methods=['GET'])
@jwt_required()
def get_moods():
    current_user_id = get_jwt_identity()
    moods = Mood.query.filter_by(user_id=current_user_id).order_by(Mood.date.desc()).all()
    
    return jsonify([mood.to_dict() for mood in moods]), 200

@mood_bp.route('/all', methods=['DELETE'])
@jwt_required()
def delete_all_moods():
    """Delete all moods for user"""
    current_user_id = get_jwt_identity()
    try:
        Mood.query.filter_by(user_id=current_user_id).delete()
        db.session.commit()
        return jsonify({'message': 'All moods deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete all moods', 'error': str(e)}), 500

@mood_bp.route('/analysis', methods=['GET'])
@jwt_required()
def get_mood_analysis():
    """Get advanced mood analysis with patterns"""
    current_user_id = get_jwt_identity()
    days = request.args.get('days', 30, type=int)
    
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    moods = Mood.query.filter_by(user_id=current_user_id).filter(
        Mood.date >= cutoff_date
    ).order_by(Mood.date.asc()).all()
    
    if not moods:
        return jsonify({
            'message': 'Not enough data for analysis',
            'total_entries': 0,
            'average_mood_score': 0,
            'mood_distribution': {},
            'trend': None,
            'patterns': [],
            'insights': 'Log more moods to get personalized insights!'
        }), 200
    
    # Calculate statistics
    mood_counts = Counter(m.mood for m in moods)
    mood_scores = [MOOD_SCORES.get(m.mood, 50) for m in moods]
    
    # Trend Analysis (recent vs earlier)
    mid_point = len(moods) // 2
    recent_scores = mood_scores[mid_point:]
    earlier_scores = mood_scores[:mid_point]
    
    recent_avg = sum(recent_scores) / len(recent_scores) if recent_scores else 0
    earlier_avg = sum(earlier_scores) / len(earlier_scores) if earlier_scores else 0
    
    trend = None
    if recent_avg > earlier_avg + 10:
        trend = 'improving'
    elif recent_avg < earlier_avg - 10:
        trend = 'declining'
    else:
        trend = 'stable'
    
    # Find patterns by day of week  
    day_moods = {}
    for mood in moods:
        day_name = mood.date.strftime('%A')
        if day_name not in day_moods:
            day_moods[day_name] = []
        day_moods[day_name].append(MOOD_SCORES.get(mood.mood, 50))
    
    day_patterns = {}
    for day, scores in day_moods.items():
        day_patterns[day] = sum(scores) / len(scores) if scores else 0
    
    # Identify worst days
    worst_days = sorted(day_patterns.items(), key=lambda x: x[1])[:2]
    
    # Generate insights
    insights = []
    
    if trend == 'improving':
        insights.append("🌟 Your mood has been improving! Keep up the positive momentum.")
    elif trend == 'declining':
        insights.append("📉 Your mood seems to be declining. Consider reaching out for extra support.")
    else:
        insights.append("📊 Your mood has been relatively stable. Consistency is great!")
    
    # Mood distribution insight
    dominant_mood = mood_counts.most_common(1)[0][0]
    insights.append(f"💭 Your most common mood is {dominant_mood}. This is your baseline.")
    
    # Day-specific insights
    if worst_days:
        worst_day = worst_days[0][0]
        insights.append(f"⚠️ You tend to feel lower on {worst_day}s. Plan extra self-care for those days.")
    
    # Variability insight
    mood_variance = max(mood_scores) - min(mood_scores) if mood_scores else 0
    if mood_variance > 50:
        insights.append("🎢 Your moods fluctuate quite a bit. Grounding exercises might help stabilize them.")
    
    return jsonify({
        'total_entries': len(moods),
        'average_mood_score': sum(mood_scores) / len(mood_scores),
        'mood_distribution': dict(mood_counts),
        'trend': trend,
        'recent_average': recent_avg,
        'earlier_average': earlier_avg,
        'daily_patterns': day_patterns,
        'worst_days': [day for day, _ in worst_days],
        'insights': insights,
        'mood_data': [
            {
                'date': m.date.isoformat(),
                'mood': m.mood,
                'score': MOOD_SCORES.get(m.mood, 50),
                'note': m.note
            }
            for m in moods
        ]
    }), 200

@mood_bp.route('/insights', methods=['GET'])
@jwt_required()
def get_mood_insights():
    """Get AI-generated insights about mood patterns"""
    current_user_id = get_jwt_identity()
    days = request.args.get('days', 7, type=int)
    
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    moods = Mood.query.filter_by(user_id=current_user_id).filter(
        Mood.date >= cutoff_date
    ).order_by(Mood.date.desc()).limit(10).all()
    
    if len(moods) < 2:
        return jsonify({
            'message': 'Log more moods to get insights',
            'recommendation': 'Track your mood daily for better personalized insights'
        }), 200
    
    # Calculate trend
    recent_moods = moods[:5]
    older_moods = moods[5:]
    
    recent_scores = [MOOD_SCORES.get(m.mood, 50) for m in recent_moods]
    older_scores = [MOOD_SCORES.get(m.mood, 50) for m in older_moods]
    
    recent_avg = sum(recent_scores) / len(recent_scores)
    older_avg = sum(older_scores) / len(older_scores) if older_scores else recent_avg
    
    recommendations = []
    
    if recent_avg > older_avg + 15:
        recommendations.extend([
            "✨ Your mood has been improving!",
            "🎯 What changes did you make? Keep doing them!",
            "💪 You're building positive momentum. Celebrate this progress!"
        ])
    elif recent_avg < older_avg - 15:
        recommendations.extend([
            "💙 It looks like you're going through a tough time",
            "🤝 Consider reaching out to someone you trust",
            "📞 Remember that our counselors are here to help - book a session anytime"
        ])
    else:
        recommendations.extend([
            "📝 Your mood has been steady - that's good consistency",
            "🧘 Try a new coping strategy this week to see what helps",
            "📚 Check out our resources for more support options"
        ])
    
    return jsonify({
        'period_days': days,
        'entries_analyzed': len(moods),
        'recent_average': recent_avg,
        'previous_average': older_avg,
        'change': recent_avg - older_avg,
        'recommendations': recommendations
    }), 200

@mood_bp.route('/today-status', methods=['GET'])
@jwt_required()
def check_today_mood():
    current_user_id = get_jwt_identity()
    # Get today's start in UTC
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    mood_exists = Mood.query.filter_by(user_id=current_user_id).filter(
        Mood.date >= today_start
    ).first()
    
    return jsonify({
        'logged_today': bool(mood_exists)
    }), 200

