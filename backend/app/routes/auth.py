from flask import Blueprint, request, jsonify
from app import db
from app.models import User
import bcrypt

auth_bp = Blueprint('auth_bp', __name__)

# ✅ DB Check Route
@auth_bp.route('/check-db')
def check_db():
    try:
        result = db.session.execute('SELECT 1').fetchone()
        return jsonify({'message': 'DB working', 'result': result[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ✅ Register Route
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    full_name = data.get('full_name')
    email = data.get('email')
    password = data.get('password')
    phone_number = data.get('phone_number')
    address = data.get('address')
    role = data.get('role')

    if not all([full_name, email, password, phone_number, address, role]):
        return jsonify({'message': 'All fields are required'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Email already exists'}), 409

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    new_user = User(
        email=email,
        role=role,
        password=hashed_password,
        full_name=full_name,
        phone_number=phone_number,
        address=address
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

# ✅ Login Route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({
            'message': 'Login successful',
            'user_id': user.user_id,
            'role': user.role,
            'full_name': user.full_name
        }), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    user = User.query.filter_by(user_id=user_id).first()
    if user:
        return jsonify({
            "status": "success",
            "data": {
                "user_id": user.user_id,
                "full_name": user.full_name,
                "email": user.email,
                "phone_number": user.phone_number,
                "address": user.address,
                "role": user.role,
                "profile_picture": user.profile_picture
            }
        })
    return jsonify({"status": "error", "message": "User not found"}), 404


# Update profile
@auth_bp.route('/auth/update-profile', methods=['PUT'])
def update_profile():
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"status": "error", "message": "User ID missing"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    user.full_name = data.get("name", user.full_name)
    user.email = data.get("email", user.email)
    user.phone_number = data.get("phone", user.phone_number)
    user.address = data.get("address", user.address)

    db.session.commit()

    return jsonify({"status": "success", "message": "Profile updated successfully"})