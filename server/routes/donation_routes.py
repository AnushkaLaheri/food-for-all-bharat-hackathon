import os
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import db
from utils import token_required, role_required, save_file, format_response

# Create blueprint
donation_bp = Blueprint('donation', __name__)

@donation_bp.route('', methods=['POST'])
@token_required
@role_required(['donor'])
def create_donation():
    """Create a new food donation"""
    # Get form data
    food_item = request.form.get('food_item')
    quantity = request.form.get('quantity')
    expiry_date = request.form.get('expiry_date')
    description = request.form.get('description', '')
    
    # Validate required fields
    if not food_item or not quantity or not expiry_date:
        return format_response('error', 'Food item, quantity, and expiry date are required', error='Validation error'), 400
    
    # Validate quantity is a positive number
    try:
        quantity = int(quantity)
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
    except ValueError:
        return format_response('error', 'Quantity must be a positive number', error='Validation error'), 400
    
    # Validate expiry date format and is in the future
    try:
        expiry_date_obj = datetime.strptime(expiry_date, '%Y-%m-%d')
        if expiry_date_obj < datetime.now():
            return format_response('error', 'Expiry date must be in the future', error='Validation error'), 400
    except ValueError:
        return format_response('error', 'Invalid expiry date format (YYYY-MM-DD)', error='Validation error'), 400
    
    # Process donation image if provided
    donation_image = None
    if 'donation_image' in request.files:
        file = request.files['donation_image']
        if file and file.filename != '':
            donation_image = save_file(file, current_app.config['DONATION_IMAGES_FOLDER'])
    
    # Insert donation into database
    try:
        donation_id = db.insert(
            "INSERT INTO fooddonations (food_item, quantity, expiry_date, description, donor_id, donation_image) VALUES (%s, %s, %s, %s, %s, %s)",
            (food_item, quantity, expiry_date, description, request.user['user_id'], donation_image)
        )
        
        # Get the created donation
        donation = db.fetch_one("SELECT * FROM fooddonations WHERE donation_id = %s", (donation_id,))
        
        # Format donation image URL if it exists
        if donation['donation_image']:
            donation['donation_image'] = f"/uploads/donation_images/{donation['donation_image']}"
        
        return format_response('success', 'Donation created successfully', data=donation), 201
    except Exception as e:
        return format_response('error', 'Failed to create donation', error=str(e)), 500

@donation_bp.route('', methods=['GET'])
@token_required
def get_donations():
    """Get all donations with optional filtering"""
    # Get query parameters
    status = request.args.get('status')
    donor_id = request.args.get('donor_id')
    
    # Build query
    query = "SELECT d.*, u.full_name as donor_name FROM fooddonations d JOIN users u ON d.donor_id = u.user_id"
    params = []
    
    # Add filters
    where_clauses = []
    
    if status:
        where_clauses.append("d.status = %s")
        params.append(status)
    
    if donor_id:
        where_clauses.append("d.donor_id = %s")
        params.append(donor_id)
    
    # Add WHERE clause if filters exist
    if where_clauses:
        query += " WHERE " + " AND ".join(where_clauses)
    
    # Add ordering
    query += " ORDER BY d.created_at DESC"
    
    # Execute query
    try:
        donations = db.fetch_all(query, params)
        
        # Format donation image URLs
        for donation in donations:
            if donation['donation_image']:
                donation['donation_image'] = f"/uploads/donation_images/{donation['donation_image']}"
        
        return format_response('success', 'Donations retrieved successfully', data=donations), 200
    except Exception as e:
        return format_response('error', 'Failed to retrieve donations', error=str(e)), 500

@donation_bp.route('/<int:donation_id>', methods=['GET'])
@token_required
def get_donation(donation_id):
    """Get a single donation by ID"""
    try:
        # Get donation with donor information
        donation = db.fetch_one(
            "SELECT d.*, u.full_name as donor_name FROM fooddonations d JOIN users u ON d.donor_id = u.user_id WHERE d.donation_id = %s",
            (donation_id,)
        )
        
        if not donation:
            return format_response('error', 'Donation not found', error='Not found'), 404
        
        # Format donation image URL if it exists
        if donation['donation_image']:
            donation['donation_image'] = f"/uploads/donation_images/{donation['donation_image']}"
        
        return format_response('success', 'Donation retrieved successfully', data=donation), 200
    except Exception as e:
        return format_response('error', 'Failed to retrieve donation', error=str(e)), 500

@donation_bp.route('/<int:donation_id>', methods=['PUT'])
@token_required
def update_donation_status(donation_id):
    """Update donation status (for NGOs to mark as claimed)"""
    # Check if user is NGO or admin
    if request.user['role'] not in ['ngo', 'admin']:
        return format_response('error', 'Unauthorized to update donation status', error='Forbidden'), 403
    
    data = request.get_json()
    
    # Validate status
    if 'status' not in data:
        return format_response('error', 'Status is required', error='Validation error'), 400
    
    valid_statuses = ['available', 'reserved', 'claimed']
    if data['status'] not in valid_statuses:
        return format_response('error', f'Status must be one of: {valid_statuses}', error='Validation error'), 400
    
    # Check if donation exists
    donation = db.fetch_one("SELECT * FROM fooddonations WHERE donation_id = %s", (donation_id,))
    if not donation:
        return format_response('error', 'Donation not found', error='Not found'), 404
    
    # Update donation status
    try:
        db.update(
            "UPDATE fooddonations SET status = %s, updated_at = NOW() WHERE donation_id = %s",
            (data['status'], donation_id)
        )
        
        # Get updated donation
        updated_donation = db.fetch_one("SELECT * FROM fooddonations WHERE donation_id = %s", (donation_id,))
        
        # Format donation image URL if it exists
        if updated_donation['donation_image']:
            updated_donation['donation_image'] = f"/uploads/donation_images/{updated_donation['donation_image']}"
        
        return format_response('success', 'Donation status updated successfully', data=updated_donation), 200
    except Exception as e:
        return format_response('error', 'Failed to update donation status', error=str(e)), 500