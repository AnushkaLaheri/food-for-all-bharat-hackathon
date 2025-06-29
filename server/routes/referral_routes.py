from flask import Blueprint, request, jsonify
import db
from utils import token_required, validate_email, format_response

# Create blueprint
referral_bp = Blueprint('referral', __name__)

@referral_bp.route('', methods=['POST'])
@token_required
def create_referral():
    """Create a new referral"""
    data = request.get_json()
    
    # Validate required fields
    if 'referred_email' not in data:
        return format_response('error', 'Referred email is required', error='Validation error'), 400
    
    # Validate email format
    if not validate_email(data['referred_email']):
        return format_response('error', 'Invalid email format', error='Validation error'), 400
    
    # Check if email already exists in users
    existing_user = db.fetch_one("SELECT * FROM users WHERE email = %s", (data['referred_email'],))
    if existing_user:
        return format_response('error', 'This email is already registered', error='Duplicate entry'), 409
    
    # Check if email already exists in referrals
    existing_referral = db.fetch_one(
        "SELECT * FROM referrals WHERE referred_email = %s AND referrer_id = %s", 
        (data['referred_email'], request.user['user_id'])
    )
    if existing_referral:
        return format_response('error', 'You have already referred this email', error='Duplicate entry'), 409
    
    # Insert referral
    try:
        referral_id = db.insert(
            "INSERT INTO referrals (referrer_id, referred_email, referred_name, message) VALUES (%s, %s, %s, %s)",
            (
                request.user['user_id'], 
                data['referred_email'], 
                data.get('referred_name', ''),
                data.get('message', '')
            )
        )
        
        # Get the created referral
        referral = db.fetch_one("SELECT * FROM referrals WHERE referral_id = %s", (referral_id,))
        
        return format_response('success', 'Referral created successfully', data=referral), 201
    except Exception as e:
        return format_response('error', 'Failed to create referral', error=str(e)), 500

@referral_bp.route('', methods=['GET'])
@token_required
def get_my_referrals():
    """Get referrals made by the current user"""
    try:
        # Get user's referrals
        referrals = db.fetch_all(
            "SELECT * FROM referrals WHERE referrer_id = %s ORDER BY created_at DESC",
            (request.user['user_id'],)
        )
        
        return format_response('success', 'Referrals retrieved successfully', data=referrals), 200
    except Exception as e:
        return format_response('error', 'Failed to retrieve referrals', error=str(e)), 500

@referral_bp.route('/all', methods=['GET'])
@token_required
def get_all_referrals():
    """Get all referrals (admin only)"""
    # Check if user is admin
    if request.user['role'] != 'admin':
        return format_response('error', 'Unauthorized to access all referrals', error='Forbidden'), 403
    
    try:
        # Get all referrals with referrer information
        referrals = db.fetch_all(
            """SELECT r.*, u.full_name as referrer_name, u.email as referrer_email 
               FROM referrals r 
               JOIN users u ON r.referrer_id = u.user_id 
               ORDER BY r.created_at DESC"""
        )
        
        return format_response('success', 'All referrals retrieved successfully', data=referrals), 200
    except Exception as e:
        return format_response('error', 'Failed to retrieve all referrals', error=str(e)), 500