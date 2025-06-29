import os
import re
import uuid
import bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from werkzeug.utils import secure_filename

# Password validation regex
PASSWORD_PATTERN = r'^.{4,}$'
EMAIL_PATTERN = r'^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$'
PHONE_PATTERN = r'^\+?[0-9]{10,15}$'

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    """Check if the file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file, folder):
    """Save a file to the specified folder with a unique filename"""
    if file and allowed_file(file.filename):
        # Create a unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        
        # Ensure the folder exists
        os.makedirs(folder, exist_ok=True)
        
        # Save the file
        file_path = os.path.join(folder, unique_filename)
        file.save(file_path)
        
        return unique_filename
    return None

def hash_password(password):
    """Hash a password using bcrypt"""
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def check_password(password, hashed_password):
    """Check if a password matches the hashed password"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def validate_password(password):
    """Validate a password against the password pattern"""
    return re.match(PASSWORD_PATTERN, password) is not None

def validate_email(email):
    """Validate an email address"""
    return re.match(EMAIL_PATTERN, email) is not None

def validate_phone(phone):
    """Validate a phone number"""
    return re.match(PHONE_PATTERN, phone) is not None

def generate_token(user_id, role, expiry=24):
    """Generate a JWT token for authentication"""
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=expiry),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def decode_token(token):
    """Decode a JWT token"""
    try:
        return jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorator to require a valid token for a route"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({
                'status': 'error',
                'message': 'Token is missing',
                'error': 'Unauthorized access'
            }), 401
        
        # Decode token
        data = decode_token(token)
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'Token is invalid or expired',
                'error': 'Unauthorized access'
            }), 401
        
        # Add user data to request
        request.user = data
        
        return f(*args, **kwargs)
    
    return decorated

def role_required(roles):
    """Decorator to require specific roles for a route"""
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated_function(*args, **kwargs):
            if request.user['role'] not in roles:
                return jsonify({
                    'status': 'error',
                    'message': 'Insufficient permissions',
                    'error': 'Forbidden'
                }), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def format_response(status, message, data=None, error=None):
    """Format a standard API response"""
    response = {
        'status': status,
        'message': message
    }
    
    if data is not None:
        response['data'] = data
    
    if error is not None:
        response['error'] = error
    
    return jsonify(response)