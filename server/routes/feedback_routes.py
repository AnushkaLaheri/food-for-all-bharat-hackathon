from flask import Blueprint, request, jsonify
import db
from utils import token_required, role_required, format_response

# Create blueprint
feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('', methods=['POST'])
@token_required
def submit_feedback():
    """Submit feedback"""
    data = request.get_json()
    
    # Validate required fields
    if 'feedback_text' not in data:
        return format_response('error', 'Feedback text is required', error='Validation error'), 400
    
    # Get optional fields
    rating = data.get('rating')
    if rating is not None:
        try:
            rating = int(rating)
            if rating < 1 or rating > 5:
                return format_response('error', 'Rating must be between 1 and 5', error='Validation error'), 400
        except ValueError:
            return format_response('error', 'Rating must be a number', error='Validation error'), 400
    
    # Insert feedback
    try:
        feedback_id = db.insert(
            "INSERT INTO feedback (user_id, feedback_text, rating) VALUES (%s, %s, %s)",
            (request.user['user_id'], data['feedback_text'], rating)
        )
        
        # Get the created feedback
        feedback = db.fetch_one("SELECT * FROM feedback WHERE feedback_id = %s", (feedback_id,))
        
        return format_response('success', 'Feedback submitted successfully', data=feedback), 201
    except Exception as e:
        return format_response('error', 'Failed to submit feedback', error=str(e)), 500

@feedback_bp.route('', methods=['GET'])
@token_required
@role_required(['admin'])
def get_all_feedback():
    """Get all feedback (admin only)"""
    try:
        # Get all feedback with user information
        feedback = db.fetch_all(
            """SELECT f.*, u.full_name, u.email, u.role 
               FROM feedback f 
               JOIN users u ON f.user_id = u.user_id 
               ORDER BY f.created_at DESC"""
        )
        
        return format_response('success', 'Feedback retrieved successfully', data=feedback), 200
    except Exception as e:
        return format_response('error', 'Failed to retrieve feedback', error=str(e)), 500

@feedback_bp.route('/my-feedback', methods=['GET'])
@token_required
def get_my_feedback():
    """Get feedback submitted by the current user"""
    try:
        # Get user's feedback
        feedback = db.fetch_all(
            "SELECT * FROM feedback WHERE user_id = %s ORDER BY created_at DESC",
            (request.user['user_id'],)
        )
        
        return format_response('success', 'Feedback retrieved successfully', data=feedback), 200
    except Exception as e:
        return format_response('error', 'Failed to retrieve feedback', error=str(e)), 500