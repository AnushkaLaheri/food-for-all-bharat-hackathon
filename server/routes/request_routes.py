from flask import Blueprint, request, jsonify, current_app
import db
from utils import token_required, role_required, format_response
from datetime import datetime

# Create blueprint
request_bp = Blueprint('request', __name__)

@request_bp.route('', methods=['POST'])
@token_required
@role_required(['consumer', 'ngo'])
def create_request():
    """Create a new food request"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['donation_id', 'quantity_requested']
    for field in required_fields:
        if field not in data:
            return format_response('error', f'{field} is required', error='Validation error'), 400
    
    # Validate quantity is positive
    if not isinstance(data['quantity_requested'], int) or data['quantity_requested'] <= 0:
        return format_response('error', 'Quantity must be a positive number', error='Validation error'), 400
    
    # Check if donation exists and is available
    donation = db.fetch_one(
        "SELECT * FROM fooddonations WHERE donation_id = %s AND status = 'available'",
        (data['donation_id'],)
    )
    
    if not donation:
        return format_response('error', 'Donation not found or not available', error='Not found'), 404
    
    # Check if requested quantity is available
    if data['quantity_requested'] > donation['quantity']:
        return format_response('error', 'Requested quantity exceeds available quantity', error='Validation error'), 400
    
    # Get optional fields
    purpose = data.get('purpose', '')
    
    try:
        # Insert request
        request_id = db.insert(
            """INSERT INTO requests 
               (donation_id, requester_id, quantity_requested, purpose, status) 
               VALUES (%s, %s, %s, %s, 'pending')""",
            (data['donation_id'], request.user['user_id'], data['quantity_requested'], purpose)
        )
        
        # Get the created request
        new_request = db.fetch_one("SELECT * FROM requests WHERE request_id = %s", (request_id,))
        
        return format_response('success', 'Request created successfully', data={'request': new_request}), 201
    except Exception as e:
        current_app.logger.error(f"Error creating request: {str(e)}")
        return format_response('error', 'Failed to create request', error=str(e)), 500

@request_bp.route('/pending', methods=['GET'])
@token_required
@role_required(['donor', 'ngo', 'admin'])
def list_pending_requests():
    """List pending requests with optional filters"""
    try:
        # Get query parameters
        status = request.args.get('status', 'pending')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        offset = (page - 1) * limit
        
        # Base query
        query = """
            SELECT r.*, u.full_name as requester_name, u.email as requester_email, 
                   d.food_item, d.donor_id, d.donation_image
            FROM requests r
            JOIN users u ON r.requester_id = u.user_id
            JOIN fooddonations d ON r.donation_id = d.donation_id
            WHERE 1=1
        """
        params = []
        
        # Add status filter if provided
        if status:
            query += " AND r.status = %s"
            params.append(status)
        
        # Add donor filter if user is a donor
        if request.user['role'] == 'donor':
            query += " AND d.donor_id = %s"
            params.append(request.user['user_id'])
        
        # Count total matching requests
        count_query = f"SELECT COUNT(*) as count FROM ({query}) as filtered_requests"
        count_result = db.fetch_one(count_query, tuple(params))
        total = count_result['count'] if count_result else 0
        
        # Add pagination
        query += " ORDER BY r.created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        # Execute query
        requests_list = db.fetch_all(query, tuple(params))
        
        # Format response with pagination info
        return format_response('success', 'Requests retrieved successfully', data={
            'requests': requests_list,
            'pagination': {
                'total': total,
                'page': page,
                'limit': limit,
                'pages': (total + limit - 1) // limit
            }
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error listing requests: {str(e)}")
        return format_response('error', 'Failed to retrieve requests', error=str(e)), 500

@request_bp.route('/<int:request_id>/accept', methods=['POST'])
@token_required
@role_required(['donor'])
def accept_request(request_id):
    """Accept a request (donor only)"""
    try:
        # Get the request
        req = db.fetch_one(
            """SELECT r.*, d.donor_id, d.quantity as available_quantity 
               FROM requests r 
               JOIN fooddonations d ON r.donation_id = d.donation_id 
               WHERE r.request_id = %s""", 
            (request_id,)
        )
        
        if not req:
            return format_response('error', 'Request not found', error='Not found'), 404
        
        # Check if user is the donor of the requested donation
        if req['donor_id'] != request.user['user_id']:
            return format_response('error', 'You can only accept requests for your own donations', error='Forbidden'), 403
        
        # Check if request is pending
        if req['status'] != 'pending':
            return format_response('error', f'Request is already {req["status"]}', error='Invalid status'), 400
        
        # Check if requested quantity is still available
        if req['quantity_requested'] > req['available_quantity']:
            return format_response('error', 'Requested quantity exceeds available quantity', error='Validation error'), 400
        
        # Start a transaction
        db.execute_query("START TRANSACTION")
        
        try:
            # Update request status
            db.update(
                "UPDATE requests SET status = 'approved', updated_at = NOW() WHERE request_id = %s",
                (request_id,)
            )
            
            # Update donation quantity
            new_quantity = req['available_quantity'] - req['quantity_requested']
            
            if new_quantity > 0:
                # Update quantity
                db.update(
                    "UPDATE fooddonations SET quantity = %s WHERE donation_id = %s",
                    (new_quantity, req['donation_id'])
                )
            else:
                # Mark as claimed if no quantity left
                db.update(
                    "UPDATE fooddonations SET quantity = 0, status = 'claimed' WHERE donation_id = %s",
                    (req['donation_id'],)
                )
            
            # Commit transaction
            db.execute_query("COMMIT")
            
            return format_response('success', 'Request accepted successfully'), 200
        except Exception as e:
            # Rollback transaction on error
            db.execute_query("ROLLBACK")
            raise e
    except Exception as e:
        current_app.logger.error(f"Error accepting request: {str(e)}")
        return format_response('error', 'Failed to accept request', error=str(e)), 500

@request_bp.route('/<int:request_id>/reject', methods=['POST'])
@token_required
@role_required(['donor'])
def reject_request(request_id):
    """Reject a request (donor only)"""
    try:
        # Get the request
        req = db.fetch_one(
            """SELECT r.*, d.donor_id 
               FROM requests r 
               JOIN fooddonations d ON r.donation_id = d.donation_id 
               WHERE r.request_id = %s""", 
            (request_id,)
        )
        
        if not req:
            return format_response('error', 'Request not found', error='Not found'), 404
        
        # Check if user is the donor of the requested donation
        if req['donor_id'] != request.user['user_id']:
            return format_response('error', 'You can only reject requests for your own donations', error='Forbidden'), 403
        
        # Check if request is pending
        if req['status'] != 'pending':
            return format_response('error', f'Request is already {req["status"]}', error='Invalid status'), 400
        
        # Update request status
        db.update(
            "UPDATE requests SET status = 'rejected', updated_at = NOW() WHERE request_id = %s",
            (request_id,)
        )
        
        return format_response('success', 'Request rejected successfully'), 200
    except Exception as e:
        current_app.logger.error(f"Error rejecting request: {str(e)}")
        return format_response('error', 'Failed to reject request', error=str(e)), 500

@request_bp.route('/my-requests', methods=['GET'])
@token_required
def get_my_requests():
    """Get requests made by the current user"""
    try:
        # Get query parameters
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        offset = (page - 1) * limit
        
        # Base query
        query = """
            SELECT r.*, d.food_item, d.donation_image, u.full_name as donor_name
            FROM requests r
            JOIN fooddonations d ON r.donation_id = d.donation_id
            JOIN users u ON d.donor_id = u.user_id
            WHERE r.requester_id = %s
        """
        params = [request.user['user_id']]
        
        # Add status filter if provided
        if status:
            query += " AND r.status = %s"
            params.append(status)
        
        # Count total matching requests
        count_query = f"SELECT COUNT(*) as count FROM ({query}) as filtered_requests"
        count_result = db.fetch_one(count_query, tuple(params))
        total = count_result['count'] if count_result else 0
        
        # Add pagination
        query += " ORDER BY r.created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        # Execute query
        requests_list = db.fetch_all(query, tuple(params))
        
        # Format response with pagination info
        return format_response('success', 'Requests retrieved successfully', data={
            'requests': requests_list,
            'pagination': {
                'total': total,
                'page': page,
                'limit': limit,
                'pages': (total + limit - 1) // limit
            }
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving requests: {str(e)}")
        return format_response('error', 'Failed to retrieve requests', error=str(e)), 500