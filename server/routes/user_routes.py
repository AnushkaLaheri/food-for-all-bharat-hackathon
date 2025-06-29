import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import db
from utils import (
    hash_password, check_password, generate_token, token_required,
    validate_email, validate_password, validate_phone, save_file,
    format_response
)

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    required = ['email', 'password', 'full_name', 'phone_number', 'address', 'role']
    if not all(k in data for k in required):
        return format_response('error', 'Missing fields', error='Validation error'), 400

    hashed = hash_password(data['password'])
    try:
        db.insert("""
            INSERT INTO users (email, password, full_name, phone_number, address, role)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (data['email'], hashed, data['full_name'], data['phone_number'], data['address'], data['role']))
        return format_response('success', 'Registered successfully'), 201
    except Exception as e:
        return format_response('error', 'Registration failed', error=str(e)), 500

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = db.fetch_one("SELECT * FROM users WHERE email = %s", (data['email'],))
    if not user or not check_password(data['password'], user['password']):
        return format_response('error', 'Invalid credentials', error='Unauthorized'), 401
    token = generate_token(user['user_id'], user['role'])
    return format_response('success', 'Login successful', data={
        'user_id': user['user_id'],
        'role': user['role'],
        'token': token
    }), 200

@user_bp.route('/profile/<int:user_id>', methods=['GET'])
@token_required
def get_profile(user_id):
    if request.user['user_id'] != user_id and request.user['role'] != 'admin':
        return format_response('error', 'Unauthorized', error='Forbidden'), 403
    user = db.fetch_one("SELECT user_id, email, full_name, phone_number, address, role, profile_picture, created_at FROM users WHERE user_id = %s", (user_id,))
    if not user:
        return format_response('error', 'User not found'), 404
    if user['profile_picture']:
        user['profile_picture'] = f"/uploads/profile_pictures/{user['profile_picture']}"
    return format_response('success', 'Profile loaded', data=user), 200
