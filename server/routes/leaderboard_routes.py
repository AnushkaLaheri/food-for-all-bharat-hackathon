from flask import Blueprint, request, jsonify
import db
from utils import token_required, format_response

# Create blueprint
leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('', methods=['GET'])
def get_leaderboard():
    """Get top donors by donation count"""
    try:
        # Get query parameters
        limit = request.args.get('limit', 10, type=int)
        
        # Get top donors by donation count
        donors = db.fetch_all(
            """SELECT u.user_id, u.full_name, u.profile_picture, COUNT(d.donation_id) as donation_count, 
                  SUM(d.quantity) as total_quantity
               FROM users u 
               JOIN fooddonations d ON u.user_id = d.donor_id 
               GROUP BY u.user_id, u.full_name, u.profile_picture 
               ORDER BY donation_count DESC, total_quantity DESC 
               LIMIT %s""",
            (limit,)
        )
        
        # Format profile picture URLs
        for donor in donors:
            if donor['profile_picture']:
                donor['profile_picture'] = f"/uploads/profile_pictures/{donor['profile_picture']}"
        
        return format_response('success', 'Leaderboard retrieved successfully', data=donors), 200
    except Exception as e:
        return format_response('error', 'Failed to retrieve leaderboard', error=str(e)), 500

@leaderboard_bp.route('/monthly', methods=['GET'])
def get_monthly_leaderboard():
    """Get top donors for the current month"""
    try:
        # Get query parameters
        limit = request.args.get('limit', 10, type=int)
        
        # Get top donors for the current month
        donors = db.fetch_all(
            """SELECT u.user_id, u.full_name, u.profile_picture, COUNT(d.donation_id) as donation_count, 
                  SUM(d.quantity) as total_quantity
               FROM users u 
               JOIN fooddonations d ON u.user_id = d.donor_id 
               WHERE MONTH(d.created_at) = MONTH(CURRENT_DATE()) AND YEAR(d.created_at) = YEAR(CURRENT_DATE())
               GROUP BY u.user_id, u.full_name, u.profile_picture 
               ORDER BY donation_count DESC, total_quantity DESC 
               LIMIT %s""",
            (limit,)
        )
        
        # Format profile picture URLs
        for donor in donors:
            if donor['profile_picture']:
                donor['profile_picture'] = f"/uploads/profile_pictures/{donor['profile_picture']}"
        
        return format_response('success', 'Monthly leaderboard retrieved successfully', data=donors), 200
    except Exception as e:
        return format_response('error', 'Failed to retrieve monthly leaderboard', error=str(e)), 500